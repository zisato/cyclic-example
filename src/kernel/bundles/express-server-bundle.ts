import { Server } from 'http'
import { AwilixContainer, asValue } from 'awilix'
import cors from 'cors'
import express, { NextFunction, RequestHandler, Router, Request, Response } from 'express'
import joi, { ObjectSchema } from 'joi'
import { AbstractBundle } from '../bundle/abstract-bundle'
import { Configuration } from '../container/configuration'
import { Container } from '../container/container'
import { AwilixContainer as CompiledContainer } from '../container/awilix-container'
import { HttpServer, PreServerStart, PreServerStartMethod } from '../http-kernel'

export interface ErrorHandlerMiddleware {
  handle: (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>
}

export interface RequestHandlerMiddleware {
  handle: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>
}

export type RouteHandler = (req: Request, res: Response) => Promise<void>

export interface RouteLoader {
  loadRoutes: (container: Container) => Router[]
}

export class ExpressServerBundle extends AbstractBundle {
  private readonly routeLoader: RouteLoader
  private readonly preServerStart: PreServerStart

  constructor (routeLoader?: RouteLoader, preServerStart?: PreServerStart) {
    super()
    this.routeLoader = routeLoader ?? {
      loadRoutes (_container: Container): Router[] {
        return []
      }
    }
    this.preServerStart = preServerStart ?? {
      loadMethods (_container: Container, _configuration: Configuration): Array<() => Promise<void>> {
        return []
      }
    }
  }

  name (): string {
    return 'expressServer'
  }

  configSchema (): ObjectSchema | null {
    const corsSchema = joi.object({
      'express.cors': joi.object({
        origin: joi.alternatives().try(joi.string(), joi.boolean(), joi.array().items(joi.string()))
      })
    })
    const staticSchema = joi.object({
      'express.static': joi.object({
        dir: joi.string().required()
      })
    })
    const jsonSchema = joi.object({
      'express.json': joi.object({
        inflate: joi.boolean().default(true),
        limit: joi.alternatives().try(joi.string(), joi.number()).default('100kb'),
        strict: joi.boolean().default(true),
        type: joi.alternatives().try(joi.string(), joi.array().items(joi.string())).default('application/json')
      })
    })

    return joi.object({
      port: joi.number().default(3000),
      middlewares: joi.array().items(joi.string(), corsSchema, staticSchema, jsonSchema).default([]),
      errorHandlers: joi.array().items(joi.string()).default([])
    })
  }

  loadContainer (containerBuilder: AwilixContainer, bundleConfiguration: Configuration): void {
    const middlewareIds = bundleConfiguration.get<string[] | Array<{ [key: string]: unknown }>>('expressServer.middlewares')
    this.loadExpressMiddlewares(containerBuilder, bundleConfiguration)
    const normalizedMiddlewareIds = middlewareIds.map((value: string | { [key: string]: unknown }): string => {
      if (typeof value === 'string') {
        return value
      }

      return Object.keys(value)[0]
    })

    const compiledContainer = new CompiledContainer(containerBuilder)
    const middlewares = this.resolveMiddlewares(compiledContainer, normalizedMiddlewareIds)
    const errorHandlers = this.resolveErrorHandlers(compiledContainer, bundleConfiguration.get<string[]>('expressServer.errorHandlers'))
    const routes = this.resolveRoutes(compiledContainer)
    const preServerStartMethods = this.preServerStart.loadMethods(compiledContainer, bundleConfiguration)

    containerBuilder.register({
      'expressServer.server': asValue(new ExpressHttpServer(middlewares, errorHandlers, routes, preServerStartMethods))
    })
  }

  async shutdown (container: Container): Promise<void> {
    const server = container.get<HttpServer>('expressServer.server')

    await server.stop()
  }

  private loadExpressMiddlewares (containerBuilder: AwilixContainer, bundleConfiguration: Configuration): void {
    const middlewareIds = bundleConfiguration.get<string[] | any[]>('expressServer.middlewares')

    if (middlewareIds.includes('express.json')) {
      containerBuilder.register('express.json', asValue(express.json()))
    }
    const indexJson = middlewareIds.findIndex((value) => {
      return typeof value !== 'string' && 'express.json' in value
    })
    if (indexJson > -1) {
      containerBuilder.register('express.json', asValue(express.json({
        inflate: middlewareIds[indexJson]['express.json']['inflate'],
        limit: middlewareIds[indexJson]['express.json']['limit'],
        strict: middlewareIds[indexJson]['express.json']['strict'],
        type: middlewareIds[indexJson]['express.json']['type']
      })))
    }

    if (middlewareIds.includes('express.cors')) {
      containerBuilder.register('express.cors', asValue(cors()))
    }
    const indexCors = middlewareIds.findIndex((value) => {
      return typeof value !== 'string' && 'express.cors' in value
    })
    if (indexCors > -1) {
      containerBuilder.register('express.cors', asValue(cors({
        origin: middlewareIds[indexCors]['express.cors']['origin']
      })))
    }

    const indexStatic = middlewareIds.findIndex((value) => {
      return typeof value !== 'string' && 'express.static' in value
    })
    if (indexStatic > -1) {
      containerBuilder.register('express.static', asValue(express.static(middlewareIds[indexStatic]['express.static']['dir'])))
    }
  }

  private resolveMiddlewares (container: Container, middlewares: string[]): RequestHandler[] {
    const isRequestHandler = (middleware: any): middleware is RequestHandler => {
      return typeof middleware === 'function'
    }
    const isRequestHandlerMiddleware = (middleware: any): middleware is RequestHandlerMiddleware => {
      return 'handle' in middleware
    }

    return middlewares.map((middlewareId: string): RequestHandler => {
      const middleware = container.get(middlewareId)
      if (isRequestHandlerMiddleware(middleware)) {
        return middleware.handle
      }

      if (isRequestHandler(middleware)) {
        return middleware
      }

      throw new Error(`middleware ${middlewareId} not valid instance of RequestHandlerMiddleware or RequestHandler`)
    })
  }

  private resolveErrorHandlers (container: Container, errorHandlers: string[]): ErrorHandlerMiddleware[] {
    const isErrorHandler = (errorHandler: any): errorHandler is ErrorHandlerMiddleware => {
      return 'handle' in errorHandler
    }

    return errorHandlers.map((errorHandlerId: string): ErrorHandlerMiddleware => {
      const errorHandler = container.get(errorHandlerId)
      if (!isErrorHandler(errorHandler)) {
        throw new Error(`errorHandler ${errorHandlerId} not valid instance of ErrorHandlerMiddleware`)
      }

      return errorHandler
    })
  }

  private resolveRoutes (container: Container): Router[] {
    return this.routeLoader.loadRoutes(container)
  }
}

export class ExpressHttpServer implements HttpServer {
  protected isBooted: boolean = false
  private readonly app: express.Express
  private server: Server | null = null

  constructor (
    private readonly middlewares: RequestHandler[],
    private readonly errorHandlerMiddlewares: ErrorHandlerMiddleware[],
    private readonly routes: Router[],
    private readonly preServerStart: PreServerStartMethod[]) {
    this.app = express()
  }

  boot = async (): Promise<void> => {
    if (!this.isBooted) {
      this.middlewares.forEach((middleware: RequestHandler) => {
        this.app.use(middleware)
      })

      this.routes.forEach((router: Router) => {
        this.app.use(router)
      })

      this.errorHandlerMiddlewares.forEach((errorHandlerMiddleware: ErrorHandlerMiddleware) => {
        this.app.use(errorHandlerMiddleware.handle)
      })

      this.isBooted = true
    }
  }

  start = async (port: number): Promise<Server> => {
    await this.boot()

    const promises = this.preServerStart.map(async (method: PreServerStartMethod): Promise<void> => {
      return await method()
    })

    await Promise.all(promises)

    this.server = this.app.listen(port)

    return this.server
  }

  stop = async (): Promise<void> => {
    if (this.server !== null) {
      this.server.close()
      this.server.closeAllConnections()

      this.server = null
    }
  }
}
