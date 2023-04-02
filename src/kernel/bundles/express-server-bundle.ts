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
import { ExpressServerError } from '../exception/express-server-error'

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

type MiddlewareConfigurationSchema = string | { [key: string]: any }

export class ExpressServerBundle extends AbstractBundle {
  static readonly bundleName = 'expressServer'
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
    return ExpressServerBundle.bundleName
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

    return joi.object({
      port: joi.number().default(3000),
      middlewares: joi.array().items(joi.string(), corsSchema, staticSchema).default([]),
      errorHandlers: joi.array().items(joi.string()).default([]),
      ejs: joi.object({
        views: joi.array().items(joi.string()).default([]),
      })
    })
  }

  loadContainer (containerBuilder: AwilixContainer, bundleConfiguration: Configuration): void {
    const middlewareConfigurations = bundleConfiguration.get<MiddlewareConfigurationSchema[]>('expressServer.middlewares')
    this.loadExpressMiddlewares(containerBuilder, middlewareConfigurations)
    const middlewareIds = this.getMiddlewareIds(middlewareConfigurations)

    const compiledContainer = new CompiledContainer(containerBuilder)
    const middlewares = this.resolveMiddlewares(compiledContainer, middlewareIds)
    const errorHandlers = this.resolveErrorHandlers(compiledContainer, bundleConfiguration.get<string[]>('expressServer.errorHandlers'))
    const routes = this.resolveRoutes(compiledContainer)
    const preServerStartMethods = this.preServerStart.loadMethods(compiledContainer, bundleConfiguration)

    const app = express()

    app.set('views', bundleConfiguration.get('expressServer.ejs.views'))
    app.set('view engine', 'ejs')

    containerBuilder.register({
      'expressServer.server': asValue(new ExpressHttpServer(app, middlewares, errorHandlers, routes, preServerStartMethods))
    })
  }

  async shutdown (container: Container): Promise<void> {
    const server = container.get<HttpServer>('expressServer.server')

    await server.stop()
  }

  private loadExpressMiddlewares (containerBuilder: AwilixContainer, middlewareConfigurations: MiddlewareConfigurationSchema[]): void {
    const middlewaresAsString = middlewareConfigurations.filter((middleware: MiddlewareConfigurationSchema) => {
      return typeof middleware === 'string'
    }) as string[]
    if (middlewaresAsString.includes('express.cors')) {
      containerBuilder.register('express.cors', asValue(cors()))
    }
    if (middlewaresAsString.includes('express.json')) {
      containerBuilder.register('express.json', asValue(express.json()))
    }

    const middlewaresAsObject = middlewareConfigurations.filter((middleware: MiddlewareConfigurationSchema) => {
      return typeof middleware === 'object'
    }) as Array<{ [key: string]: any }>

    const corsConfiguration = middlewaresAsObject.find((value) => {
      return 'express.cors' in value
    })
    if (corsConfiguration !== undefined) {
      containerBuilder.register('express.cors', asValue(cors({
        origin: corsConfiguration['express.cors']['origin']
      })))
    }

    const staticConfiguration = middlewaresAsObject.find((value) => {
      return 'express.static' in value
    })
    if (staticConfiguration !== undefined) {
      containerBuilder.register('express.static', asValue(express.static(staticConfiguration['express.static']['dir'])))
    }
  }

  private getMiddlewareIds(middlewareConfigurations: MiddlewareConfigurationSchema[]): string[] {
    return middlewareConfigurations.map((value: string | { [key: string]: unknown }): string => {
      if (typeof value === 'string') {
        return value
      }

      return Object.keys(value)[0]
    })
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

      throw new ExpressServerError(`middleware ${middlewareId} not valid instance of RequestHandlerMiddleware or RequestHandler`)
    })
  }

  private resolveErrorHandlers (container: Container, errorHandlers: string[]): ErrorHandlerMiddleware[] {
    const isErrorHandler = (errorHandler: any): errorHandler is ErrorHandlerMiddleware => {
      return 'handle' in errorHandler
    }

    return errorHandlers.map((errorHandlerId: string): ErrorHandlerMiddleware => {
      const errorHandler = container.get(errorHandlerId)
      if (!isErrorHandler(errorHandler)) {
        throw new ExpressServerError(`errorHandler ${errorHandlerId} not valid instance of ErrorHandlerMiddleware`)
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
  private server: Server | null = null

  constructor (
    private readonly app: express.Express,
    private readonly middlewares: RequestHandler[],
    private readonly errorHandlerMiddlewares: ErrorHandlerMiddleware[],
    private readonly routes: Router[],
    private readonly preServerStart: PreServerStartMethod[]
  ) {}

  start = async (port: number): Promise<Server> => {
    if (this.server !== null) {
      return this.server
    }

    await this.boot()

    await this.executePreServerStart()

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

  private boot = async (): Promise<void> => {
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

  private executePreServerStart = async (): Promise<void> => {
    const promises = this.preServerStart.map(async (method: PreServerStartMethod): Promise<void> => {
      return method()
    })

    await Promise.all(promises)
  }
}
