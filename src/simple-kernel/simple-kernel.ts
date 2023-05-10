import { createContainer } from 'awilix'
import { Container } from './container/container'
import { AwilixContainer } from './container/awilix-container'
import { KernelError } from './error/kernel-error'
import express, { ErrorRequestHandler, RequestHandler, Router } from 'express'
import { Express } from 'express-serve-static-core'
import { Server } from 'http'
import { AwilixContainer as AwilixContainerBase } from 'awilix'
import { Parameters } from './parameters/parameters'
import { MiddlewareConfiguration } from './configuration/middleware-configuration'
import { RouterConfiguration } from './configuration/router-configuration'
import { ErrorHandlerConfiguration } from './configuration/error-handler-configuration'
import { ViewConfiguration, ViewEngineConfiguration } from './configuration/view-configuration'
import { NodeConfigParameters } from './parameters/node-config-parameters'
import { ContainerConfiguration } from './configuration/container-configuration'

export class SimpleKernel {
    private containerConfiguration: ContainerConfiguration
    private middlewareConfiguration: MiddlewareConfiguration
    private routerConfiguration: RouterConfiguration
    private errorHandlerConfiguration: ErrorHandlerConfiguration
    private viewConfiguration: ViewConfiguration

    private isKernelBooted: boolean = false
    private parameters: Parameters | null = null
    private container: AwilixContainer | null = null
    private isExpressBooted: boolean = false
    private express: Express | null = null
    private server: Server | null = null

    constructor(
        {
            containerConfiguration,
            middlewareConfiguration,
            routerConfiguration,
            errorHandlerConfiguration,
            viewConfiguration
        }:
            {
                containerConfiguration?: ContainerConfiguration;
                middlewareConfiguration?: MiddlewareConfiguration;
                routerConfiguration?: RouterConfiguration;
                errorHandlerConfiguration?: ErrorHandlerConfiguration;
                viewConfiguration?: ViewConfiguration
            }) {
        this.containerConfiguration = containerConfiguration ?? {
            configureContainer(_container: AwilixContainerBase, _parameters: Parameters): void {}
        }
        this.middlewareConfiguration = middlewareConfiguration ?? {
            getMiddlewaresConfiguration(_container: Container, _parameters: Parameters): RequestHandler[] {
                return []
            }
        }
        this.routerConfiguration = routerConfiguration ?? {
            getRoutersConfiguration(_container: Container): Router[] {
                return []
            }
        }
        this.errorHandlerConfiguration = errorHandlerConfiguration ?? {
            getErrorHandlersConfiguration(_container: Container): ErrorRequestHandler[] {
                return []
            }
        }
        this.viewConfiguration = viewConfiguration ?? {
            getViewConfiguration(): ViewEngineConfiguration | undefined {
                return undefined
            }
        }
    }

    boot(): void {
        if (!this.isKernelBooted) {
            const parameters = new NodeConfigParameters()
            const container = this.loadContainer(parameters)

            this.parameters = parameters
            this.container = container
            this.isKernelBooted = true
        }
    }

    startServer(port: number): Server {
        if (this.server !== null) {
            return this.server
        }

        this.boot()
        this.bootExpress()

        const express = this.getExpress()

        this.server = express.listen(port)

        return this.server
    }

    shutdown(): void {
        this.parameters = null
        this.express = null
        if (this.container !== null) {
            this.container.dispose()
        }
        this.container = null
        if (this.server !== null) {
            this.server.close()
            this.server.closeAllConnections()
        }
        this.server = null
        this.isKernelBooted = false
        this.isExpressBooted = false
    }

    getParameters(): Parameters {
        if (this.parameters === null) {
            throw new KernelError('Cannot get parameters from non booted kernel')
        }

        return this.parameters
    }

    getContainer(): Container {
        if (this.container === null) {
            throw new KernelError('Cannot get container from non booted kernel')
        }

        return this.container
    }

    private bootExpress(): void {
        if (!this.isExpressBooted) {
            const container = this.getContainer()
            const parameters = this.getParameters()
            const app = express()

            this.loadMiddlewares(app, container, parameters)
            this.loadRouters(app, container)
            this.loadErrorHandlers(app, container, parameters)
            this.loadViewEngine(app, parameters)

            this.express = app
            this.isExpressBooted = true
        }
    }

    private loadContainer(parameters: Parameters): AwilixContainer {
        const container = createContainer()

        this.containerConfiguration.configureContainer(container, parameters)

        return new AwilixContainer(container)
    }

    private loadMiddlewares(app: Express, container: Container, parameters: Parameters): void {
        const middlewares = this.middlewareConfiguration.getMiddlewaresConfiguration(container, parameters)

        middlewares.forEach((middleware) => app.use(middleware))
    }

    private loadRouters(app: Express, container: Container): void {
        const routers = this.routerConfiguration.getRoutersConfiguration(container)

        routers.forEach((router) => app.use(router))
    }

    private loadErrorHandlers(app: Express, container: Container, parameters: Parameters): void {
        const errorHandlers = this.errorHandlerConfiguration.getErrorHandlersConfiguration(container, parameters)

        errorHandlers.forEach((errorHandler) => app.use(errorHandler))
    }

    private loadViewEngine(app: Express, parameters: Parameters): void {
        const viewEngineConfiguration = this.viewConfiguration.getViewConfiguration(parameters)

        if (viewEngineConfiguration !== undefined) {
            app.set('views', viewEngineConfiguration.views)
            app.set('view engine', viewEngineConfiguration.viewEngine)

            const render = viewEngineConfiguration.render
            if (render !== undefined) {
                app.engine(render.extension, render.fn)
            }
        }
    }

    private getExpress(): Express {
        if (this.express === null) {
            throw new KernelError('Cannot get express from non server started kernel')
        }

        return this.express
    }
}
