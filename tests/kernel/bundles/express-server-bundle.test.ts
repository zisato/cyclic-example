import { ValidationError } from 'joi'
import { asValue, createContainer } from 'awilix'
import { ExpressHttpServer, ExpressServerBundle } from '../../../src/kernel/bundles/express-server-bundle'
import { JsonConfiguration } from '../../../src/kernel/container/json-configuration'
import express, { IRouter, Router } from 'express'
import { Container } from '../../../src/kernel/container/container'
import { Server } from 'http'

describe('ExpressServerBundle unit test', () => {
  const bundle = new ExpressServerBundle()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('return name', () => {
    expect(bundle.name()).toEqual('expressServer')
  })

  describe('shutdown', () => {
    test('Should call container.get with arguments', async () => {
      const server = {
        stop: jest.fn()
      }
      const container: Partial<Container> = {
        get: jest.fn().mockReturnValue(server)
      }
  
      await bundle.shutdown(container as Container)
  
      const expectedTimes = 1
      const expectedArguments = 'expressServer.server'
      expect(container.get).toHaveBeenCalledTimes(expectedTimes)
      expect(container.get).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should call server.stop', async () => {
      const server = {
        stop: jest.fn()
      }
      const container: Partial<Container> = {
        get: jest.fn().mockReturnValue(server)
      }
  
      await bundle.shutdown(container as Container)
  
      const expectedTimes = 1
      expect(server.stop).toHaveBeenCalledTimes(expectedTimes)
    })
  })

  describe('routeLoader', () => {
    test('Should use default with no argument', async () => {
      const containerBuilder = createContainer()
      const bundleConfiguration = new JsonConfiguration({
        expressServer: {
          middlewares: [],
          errorHandlers: []
        }
      })

      bundle.loadContainer(containerBuilder, bundleConfiguration)
  
      const expectedServer = expect.objectContaining({
        middlewares: [],
        errorHandlerMiddlewares: [],
        routes: [],
        preServerStart: []
      })
      expect(containerBuilder.resolve('expressServer.server')).toEqual(expectedServer)
    })

    test('Should use provided as argument', async () => {
      const router = Router()
      const containerBuilder = createContainer()
      const bundleConfiguration = new JsonConfiguration({
        expressServer: {
          middlewares: [],
          errorHandlers: []
        }
      })
      const routeLoader = {
        loadRoutes: () => {
          return [
            router
          ]
        }
      }
      const bundleWithArgument = new ExpressServerBundle(routeLoader)

      bundleWithArgument.loadContainer(containerBuilder, bundleConfiguration)
  
      const expectedServer = expect.objectContaining({
        middlewares: [],
        errorHandlerMiddlewares: [],
        routes: [router],
        preServerStart: []
      })
      expect(containerBuilder.resolve('expressServer.server')).toEqual(expectedServer)
    })
  })

  describe('preServerStart', () => {
    test('Should use default with no argument', async () => {
      const containerBuilder = createContainer()
      const bundleConfiguration = new JsonConfiguration({
        expressServer: {
          middlewares: [],
          errorHandlers: []
        }
      })

      bundle.loadContainer(containerBuilder, bundleConfiguration)
  
      const expectedServer = expect.objectContaining({
        middlewares: [],
        errorHandlerMiddlewares: [],
        routes: [],
        preServerStart: []
      })
      expect(containerBuilder.resolve('expressServer.server')).toEqual(expectedServer)
    })

    test('Should use provided as argument', async () => {
      const preServerStartMethod = async (): Promise<void> => {}
      const containerBuilder = createContainer()
      const bundleConfiguration = new JsonConfiguration({
        expressServer: {
          middlewares: [],
          errorHandlers: []
        }
      })
      const preServerStart = {
        loadMethods: () => {
          return [
            preServerStartMethod
          ]
        }
      }
      const bundleWithArgument = new ExpressServerBundle(undefined, preServerStart)

      bundleWithArgument.loadContainer(containerBuilder, bundleConfiguration)
  
      const expectedServer = expect.objectContaining({
        middlewares: [],
        errorHandlerMiddlewares: [],
        routes: [],
        preServerStart: [preServerStartMethod]
      })
      expect(containerBuilder.resolve('expressServer.server')).toEqual(expectedServer)
    })
  })

  describe('configSchema', () => {
    test('Should validate schema successfully', () => {
      const configuration = { 
        port: 42,
        middlewares: [
          {
            'express.cors': {
              'origin': 'test-origin'
            }
          },
          {
            'express.static': {
              'dir': 'test-dir'
            }
          },
          'express.json'
        ]
       }
      const schema = bundle.configSchema()

      // @ts-expect-error
      const { value: bundleConfig, error } = schema.validate(configuration)

      const expectedConfig = { 
        port: 42,
        middlewares: [
          {
            'express.cors': {
              'origin': 'test-origin'
            }
          },
          {
            'express.static': {
              'dir': 'test-dir'
            }
          },
          'express.json'
        ],
        errorHandlers: []
      }
      expect(error).toBeUndefined()
      expect(bundleConfig).toEqual(expectedConfig)
    })
    
    test.each([['123'], [null], [false]])('Should return error when invalid port', (portValue) => {
      const configuration = { port: [portValue] }
      const schema = bundle.configSchema()

      // @ts-expect-error
      const { error } = schema.validate(configuration)

      const expectedConfig = new ValidationError('"port" must be a number', [], {})
      expect(error).toEqual(expectedConfig)
    })

    test.each([[123], [null], [false], [{ nonExistingMiddleware: { configuration: 'test' } }]])('Should return error when invalid middlewares', (middlewaresValue) => {
      const configuration = { middlewares: [middlewaresValue] }
      const schema = bundle.configSchema()

      // @ts-expect-error
      const { error } = schema.validate(configuration)

      const expectedConfig = new ValidationError('"middlewares[0]" does not match any of the allowed types', [], {})
      expect(error).toEqual(expectedConfig)
    })

    test.each([[123], [null], [false], [{}]])('Should return error when invalid errorHandlers', (errorHandlersValue) => {
      const configuration = { errorHandlers: [errorHandlersValue] }
      const schema = bundle.configSchema()

      // @ts-expect-error
      const { error } = schema.validate(configuration)

      const expectedConfig = new ValidationError('"errorHandlers[0]" must be a string', [], {})
      expect(error).toEqual(expectedConfig)
    })
  })

  describe('loadContainer', () => {
    test('Should load container with default values', () => {
      const containerBuilder = createContainer()
      const bundleConfiguration = new JsonConfiguration({
        expressServer: {
          middlewares: [],
          errorHandlers: []
        }
      })
      bundle.loadContainer(containerBuilder, bundleConfiguration)

      const expectedServer = expect.objectContaining({
        middlewares: [],
        errorHandlerMiddlewares: [],
        routes: [],
        preServerStart: []
      })
      expect(containerBuilder.hasRegistration('expressServer.server')).toBeTruthy()
      expect(containerBuilder.resolve('expressServer.server')).toEqual(expectedServer)
    })

    describe('loadExpressMiddlewares', () => {
      test('Should register express.cors when defined as string', async () => {
        const containerBuilder = createContainer()
        const bundleConfiguration = new JsonConfiguration({
          expressServer: {
            middlewares: [
              'express.cors'
            ],
            errorHandlers: []
          }
        })
        bundle.loadContainer(containerBuilder, bundleConfiguration)
  
        const expectedServer = expect.objectContaining({
          middlewares: [expect.anything()],
          errorHandlerMiddlewares: [],
          routes: [],
          preServerStart: []
        })
        expect(containerBuilder.resolve('expressServer.server')).toEqual(expectedServer)
      })

      test('Should register express.cors when defined as object', async () => {
        const containerBuilder = createContainer()
        const bundleConfiguration = new JsonConfiguration({
          expressServer: {
            middlewares: [
              {
                'express.cors': {
                  'origin': 'origin-test'
                }
              }
            ],
            errorHandlers: []
          }
        })
        bundle.loadContainer(containerBuilder, bundleConfiguration)
  
        const expectedServer = expect.objectContaining({
          middlewares: [expect.anything()],
          errorHandlerMiddlewares: [],
          routes: [],
          preServerStart: []
        })
        expect(containerBuilder.resolve('expressServer.server')).toEqual(expectedServer)
      })

      test('Should register express.json', async () => {
        const containerBuilder = createContainer()
        const bundleConfiguration = new JsonConfiguration({
          expressServer: {
            middlewares: [
              'express.json'
            ],
            errorHandlers: []
          }
        })
        bundle.loadContainer(containerBuilder, bundleConfiguration)
  
        const expectedServer = expect.objectContaining({
          middlewares: [expect.anything()],
          errorHandlerMiddlewares: [],
          routes: [],
          preServerStart: []
        })
        expect(containerBuilder.resolve('expressServer.server')).toEqual(expectedServer)
      })

      test('Should register express.static', async () => {
        const containerBuilder = createContainer()
        const bundleConfiguration = new JsonConfiguration({
          expressServer: {
            middlewares: [
              {
                'express.static': {
                  'dir': 'dir-test'
                }
              }
            ],
            errorHandlers: []
          }
        })
        bundle.loadContainer(containerBuilder, bundleConfiguration)
  
        const expectedServer = expect.objectContaining({
          middlewares: [expect.anything()],
          errorHandlerMiddlewares: [],
          routes: [],
          preServerStart: []
        })
        expect(containerBuilder.resolve('expressServer.server')).toEqual(expectedServer)
      })
    })

    describe('resolveMiddlewares', () => {
      test('Should resolve when is RequestHandlerMiddleware', async () => {
        const requestHandlerMiddleware = {
          handle: async () => {}
        }
        const containerBuilder = createContainer()
        containerBuilder.register('requestHandlerMiddleware', asValue(requestHandlerMiddleware))
        const bundleConfiguration = new JsonConfiguration({
          expressServer: {
            middlewares: [
              'requestHandlerMiddleware'
            ],
            errorHandlers: []
          }
        })
        bundle.loadContainer(containerBuilder, bundleConfiguration)
  
        const expectedServer = expect.objectContaining({
          middlewares: [expect.anything()],
          errorHandlerMiddlewares: [],
          routes: [],
          preServerStart: []
        })
        expect(containerBuilder.resolve('expressServer.server')).toEqual(expectedServer)
      })

      test('Should resolve when is function', async () => {
        const requestHandlerFunction = () => {}
        const containerBuilder = createContainer()
        containerBuilder.register('requestHandlerFunction', asValue(requestHandlerFunction))
        const bundleConfiguration = new JsonConfiguration({
          expressServer: {
            middlewares: [
              'requestHandlerFunction'
            ],
            errorHandlers: []
          }
        })
        bundle.loadContainer(containerBuilder, bundleConfiguration)
  
        const expectedServer = expect.objectContaining({
          middlewares: [expect.anything()],
          errorHandlerMiddlewares: [],
          routes: [],
          preServerStart: []
        })
        expect(containerBuilder.resolve('expressServer.server')).toEqual(expectedServer)
      })

      test('Should throw error when is not RequestHandlerMiddleware or function', async () => {
        const invalidRequestHandler = {}
        const containerBuilder = createContainer()
        containerBuilder.register('invalidRequestHandler', asValue(invalidRequestHandler))
        const bundleConfiguration = new JsonConfiguration({
          expressServer: {
            middlewares: [
              'invalidRequestHandler'
            ],
            errorHandlers: []
          }
        })
  
        const testMethod = () => {
          bundle.loadContainer(containerBuilder, bundleConfiguration)
        }

        const expectedError = new Error(`middleware invalidRequestHandler not valid instance of RequestHandlerMiddleware or RequestHandler`)
        expect(testMethod).toThrowError(expectedError)
      })
    })

    describe('resolveErrorHandlers', () => {
      test('Should resolve when is ErrorHandlerMiddleware', async () => {
        const errorHandlerMiddleware = {
          handle: async () => {}
        }
        const containerBuilder = createContainer()
        containerBuilder.register('errorHandlerMiddleware', asValue(errorHandlerMiddleware))
        const bundleConfiguration = new JsonConfiguration({
          expressServer: {
            middlewares: [],
            errorHandlers: [
              'errorHandlerMiddleware'
            ]
          }
        })
        bundle.loadContainer(containerBuilder, bundleConfiguration)
  
        const expectedServer = expect.objectContaining({
          middlewares: [],
          errorHandlerMiddlewares: [expect.anything()],
          routes: [],
          preServerStart: []
        })
        expect(containerBuilder.resolve('expressServer.server')).toEqual(expectedServer)
      })

      test('Should throw error when is not ErrorHandlerMiddleware or function', async () => {
        const invalidErrorHandlerMiddleware = {}
        const containerBuilder = createContainer()
        containerBuilder.register('invalidErrorHandlerMiddleware', asValue(invalidErrorHandlerMiddleware))
        const bundleConfiguration = new JsonConfiguration({
          expressServer: {
            middlewares: [],
            errorHandlers: [
              'invalidErrorHandlerMiddleware'
            ]
          }
        })
  
        const testMethod = () => {
          bundle.loadContainer(containerBuilder, bundleConfiguration)
        }

        const expectedError = new Error(`errorHandler invalidErrorHandlerMiddleware not valid instance of ErrorHandlerMiddleware`)
        expect(testMethod).toThrowError(expectedError)
      })
    })
  })
})

describe('ExpressHttpServer unit test', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('boot method', () => {
    const app = {
      use: jest.fn(),
      listen: jest.fn()
    } as unknown as express.Express

    test('Should call app.use with middlewares', async () => {
      const middlewareHandler = (): void => {}
      const middlewares = [middlewareHandler]
      const server = new ExpressHttpServer(app, middlewares, [], [], [])
  
      await server.start(0)
  
      const expectedTimes = 1
      const expectedArguments = [middlewareHandler]
      expect(app.use).toHaveBeenCalledTimes(expectedTimes)
      expect(app.use).toHaveBeenCalledWith(...expectedArguments)
    })
  
    test('Should call app.use with routes', async () => {
      const route = {} as IRouter
      const routes = [route]
      const server = new ExpressHttpServer(app, [], [], routes, [])
  
      await server.start(0)
  
      const expectedTimes = 1
      const expectedArguments = [route]
      expect(app.use).toHaveBeenCalledTimes(expectedTimes)
      expect(app.use).toHaveBeenCalledWith(...expectedArguments)
    })
  
    test('Should call app.use with errorHandlerMiddlewares', async () => {
      const errorHandlerMiddleware = {
        handle: async (): Promise<void> => {}
      }
      const errorHandlerMiddlewares = [errorHandlerMiddleware]
      const server = new ExpressHttpServer(app, [], errorHandlerMiddlewares, [], [])
  
      await server.start(0)
  
      const expectedTimes = 1
      const expectedArguments = [errorHandlerMiddleware.handle]
      expect(app.use).toHaveBeenCalledTimes(expectedTimes)
      expect(app.use).toHaveBeenCalledWith(...expectedArguments)
    })
  
    test('Should not call app.use when booted', async () => {
      const middlewareHandler = (): void => {}
      const middlewares = [middlewareHandler]
      const server = new ExpressHttpServer(app, middlewares, [], [], [])
  
      await server.start(0)
      await server.start(0)
  
      const expectedTimes = 1
      expect(app.use).toHaveBeenCalledTimes(expectedTimes)
    })
  })

  describe('start method', () => {
    test('Should call preServerStart promises functions ', async () => {
      const app = {
        listen: jest.fn()
      } as unknown as express.Express
      const port = 42
      let counter = 0
      const preServerStartFunction = async (): Promise<void> => {
        counter = counter + 1
      }
      const preServerStart = [preServerStartFunction]
      const server = new ExpressHttpServer(app, [], [], [], preServerStart)
  
      await server.start(port)
  
      const expectedCounter = 1
      expect(counter).toEqual(expectedCounter)
    })

    test('Should call app.listen with arguments ', async () => {
      const app = {
        listen: jest.fn()
      } as unknown as express.Express
      const port = 42
      const preServerStartFunction = async (): Promise<void> => {}
      const preServerStart = [preServerStartFunction]
      const server = new ExpressHttpServer(app, [], [], [], preServerStart)
  
      await server.start(port)
  
      const expectedTimes = 1
      const expectedArgument = 42
      expect(app.listen).toHaveBeenCalledTimes(expectedTimes)
      expect(app.listen).toHaveBeenCalledWith(expectedArgument)
    })

    test('Should return app.listen result ', async () => {
      const mockedServer = {} as Server
      const app = {
        listen: jest.fn().mockReturnValue(mockedServer)
      } as unknown as express.Express
      const port = 42
      const server = new ExpressHttpServer(app, [], [], [], [])
  
      const result = await server.start(port)

      expect(result).toEqual(mockedServer)
    })
  })

  describe('stop method', () => {
    test('Should call server.close once ', async () => {
      const mockedServer = {
        close: jest.fn(),
        closeAllConnections: jest.fn()
      } as unknown as Server
      const app = {
        listen: jest.fn().mockReturnValue(mockedServer)
      } as unknown as express.Express
      const port = 42
      const server = new ExpressHttpServer(app, [], [], [], [])
      await server.start(port)
  
      await server.stop()
  
      const expectedTimes = 1
      expect(mockedServer.close).toHaveBeenCalledTimes(expectedTimes)
    })

    test('Should call server.closeAllConnections once ', async () => {
      const mockedServer = {
        close: jest.fn(),
        closeAllConnections: jest.fn()
      } as unknown as Server
      const app = {
        listen: jest.fn().mockReturnValue(mockedServer)
      } as unknown as express.Express
      const port = 42
      const server = new ExpressHttpServer(app, [], [], [], [])
      await server.start(port)
  
      await server.stop()
  
      const expectedTimes = 1
      expect(mockedServer.closeAllConnections).toHaveBeenCalledTimes(expectedTimes)
    })
  })
})
