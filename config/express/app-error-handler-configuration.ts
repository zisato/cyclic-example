import { ErrorRequestHandler } from 'express'
import { Container } from '../../src/simple-kernel/container/container'
import { ErrorHandlerConfiguration } from '../../src/simple-kernel/configuration/error-handler-configuration'
import AppErrorHandlerMiddleware from '../../src/infrastructure/express/middleware/app-error-handler-middleware'
import { Parameters } from '../../src/simple-kernel/parameters/parameters'
import AppErrorLoggerMiddleware from '../../src/infrastructure/express/middleware/app-error-logger-middleware'

export class AppErrorHandlerConfiguration implements ErrorHandlerConfiguration {
    getErrorHandlersConfiguration(container: Container, parameters: Parameters): ErrorRequestHandler[] {
        const errorRequestHandlers: ErrorRequestHandler[] = [
            container.get<AppErrorHandlerMiddleware>('appErrorHandlerMiddleware').handle
        ]

        if (parameters.get<string>('environment') === 'development') {
            errorRequestHandlers.unshift(container.get<AppErrorLoggerMiddleware>('appErrorLoggerMiddleware').handle)
        }

        return errorRequestHandlers
    }
}
