import { ErrorRequestHandler, RequestHandler, Router } from 'express'
import { SimpleKernel } from '../../../src/simple-kernel/simple-kernel'
import { KernelError } from '../../../src/simple-kernel/error/kernel-error'
import { ContainerConfiguration } from '../../../src/simple-kernel/configuration/container-configuration'
import { AwilixContainer as AwilixContainerBase } from 'awilix'
import { Parameters } from '../../../src/simple-kernel/parameters/parameters'
import { MiddlewareConfiguration } from '../../../src/simple-kernel/configuration/middleware-configuration'
import { Container } from '../../../src/simple-kernel/container/container'
import { RouterConfiguration } from '../../../src/simple-kernel/configuration/router-configuration'
import { ErrorHandlerConfiguration } from '../../../src/simple-kernel/configuration/error-handler-configuration'
import { ViewConfiguration, ViewEngineConfiguration } from '../../../src/simple-kernel/configuration/view-configuration'

describe('SimpleKernel unit test suite', () => {
    test('Should throw error when getParameters in non booted kernel', () => {
        const kernel = new SimpleKernel({})

        expect(() => {
            kernel.getParameters()
        }).toThrow(KernelError)
    })

    test('Should throw error when getContainer in non booted kernel', () => {
        const kernel = new SimpleKernel({})

        expect(() => {
            kernel.getContainer()
        }).toThrow(KernelError)
    })
  
    test('Should load NODE_ENV parameter from config', async () => {
      const kernel = new SimpleKernel({})
  
      kernel.boot()
  
      const parameters = kernel.getParameters()
      expect(parameters.has('environment')).toBeTruthy()
    })

    test('Should load container from configuration', async () => {
        let counter = 0
        const containerConfiguration: ContainerConfiguration = {
            configureContainer: (_container: AwilixContainerBase, _parameters: Parameters): void => {
                counter = counter + 1
            }
        }
        const kernel = new SimpleKernel({ containerConfiguration })

        kernel.boot()

        const expectedCounter = 1
        expect(counter).toEqual(expectedCounter)
    })

    test('Should load middlewares from configuration', async () => {
        let counter = 0
        const middlewareConfiguration: MiddlewareConfiguration = {
            getMiddlewaresConfiguration: (_container: Container, _parameters: Parameters): RequestHandler[] => {
                counter = counter + 1

                return [
                    () => {}
                ]
            }
        }
        const kernel = new SimpleKernel({ middlewareConfiguration })

        kernel.startServer(42)
        kernel.shutdown()

        const expectedCounter = 1
        expect(counter).toEqual(expectedCounter)
    })

    test('Should load routers from configuration', async () => {
        let counter = 0
        const routerConfiguration: RouterConfiguration = {
            getRoutersConfiguration: (_container: Container): Router[] => {
                counter = counter + 1

                return [
                    Router()
                ]
            }
        }
        const kernel = new SimpleKernel({ routerConfiguration })

        kernel.startServer(42)
        kernel.shutdown()

        const expectedCounter = 1
        expect(counter).toEqual(expectedCounter)
    })

    test('Should load error handlers from configuration', async () => {
        let counter = 0
        const errorHandlerConfiguration: ErrorHandlerConfiguration = {
            getErrorHandlersConfiguration: (_container: Container, _parameters: Parameters): ErrorRequestHandler[] => {
                counter = counter + 1

                return [
                    () => {}
                ]
            }
        }
        const kernel = new SimpleKernel({ errorHandlerConfiguration })

        kernel.startServer(42)
        kernel.shutdown()

        const expectedCounter = 1
        expect(counter).toEqual(expectedCounter)
    })

    test('Should load view engine from configuration', async () => {
        let counter = 0
        const viewConfiguration: ViewConfiguration = {
            getViewConfiguration: (_parameters: Parameters): ViewEngineConfiguration | undefined => {
                counter = counter + 1

                return {
                    viewEngine: 'testViewEngine',
                    views: 'testViews',
                    render: {
                        extension: 'testExtension',
                        fn: () => {}
                    }
                }
            }
        }
        const kernel = new SimpleKernel({ viewConfiguration })

        kernel.startServer(42)
        kernel.shutdown()

        const expectedCounter = 1
        expect(counter).toEqual(expectedCounter)
    })

    test('Should return existing server', () => {
        const kernel = new SimpleKernel({})

        const server = kernel.startServer(42)
        const sameServer = kernel.startServer(21)
        kernel.shutdown()

        expect(server).toEqual(sameServer)
    })
})
