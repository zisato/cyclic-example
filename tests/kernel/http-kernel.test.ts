import { asValue, AwilixContainer } from 'awilix'
import Joi, { ObjectSchema } from 'joi'
import config from 'config'
import { AbstractBundle } from '../../src/kernel/bundle/abstract-bundle'
import { Bundle } from '../../src/kernel/bundle/bundle'
import { Configuration } from '../../src/kernel/container/configuration'
import { HttpKernel, HttpServer } from '../../src/kernel/http-kernel'
import { HttpKernelError } from '../../src/kernel/exception/http-kernel-error'

class ServerTestBundle extends AbstractBundle {
  name (): string {
    return 'serverTestBundle'
  }

  configSchema (): ObjectSchema<any> | null {
    return Joi.object({
      port: Joi.number().default(42)
    })
  }

  loadContainer (containerBuilder: AwilixContainer, _bundleConfiguration: Configuration): void {
    const server = {
      start: jest.fn()
    }
    containerBuilder.register('serverTestBundle.server', asValue(server))
  }
}

class InvalidServerTestBundle extends AbstractBundle {
  name (): string {
    return 'invalidServerTestBundle'
  }

  configSchema (): ObjectSchema<any> | null {
    return Joi.object({
      port: Joi.number().optional()
    })
  }

  loadContainer (containerBuilder: AwilixContainer, _bundleConfiguration: Configuration): void {
    const server = {
      start: jest.fn()
    }
    containerBuilder.register('invalidServerTestBundle.serverInvalid', asValue(server))
  }
}

class TestHttpKernel extends HttpKernel {
  constructor (private readonly serverBundleName: string, private readonly loadedBundles: Bundle[]) {
    super()
  }

  registerBundles (): Bundle[] {
    return this.loadedBundles
  }

  httpServerBundleName(): string {
    return this.serverBundleName
  }
}

describe('HttpKernel unit test suite', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  function givenATestHttpKernel(serverBundleName: string, serverTestBundle: Bundle): TestHttpKernel {
    return new TestHttpKernel(serverBundleName, [serverTestBundle])
  }

  describe('boot', () => {
    test('Should throw error when httpServerBundleName not in registerBundles', async () => {
      const httpKernel = givenATestHttpKernel('notRegisterBundleName', new ServerTestBundle())
      const configMock = jest.spyOn(config.util, 'toObject')
      configMock.mockReturnValueOnce({
        serverTestBundle: {}
      })

      const promise = httpKernel.startServer()

      const expectedError = new HttpKernelError('HttpServerBundleName not registered as bundle.')
      await expect(promise).rejects.toThrowError(expectedError)
    })
  })

  describe('startServer', () => {
    test('Should throw error when invalidServerTestBundle.port not exist in configuration', async () => {
      const httpKernel = givenATestHttpKernel('invalidServerTestBundle', new InvalidServerTestBundle())
      const configMock = jest.spyOn(config.util, 'toObject')
      configMock.mockReturnValueOnce({
        invalidServerTestBundle: {}
      })

      const promise = httpKernel.startServer()

      const expectedError = new HttpKernelError('HttpKernel requires invalidServerTestBundle.port in configuration')
      await expect(promise).rejects.toThrowError(expectedError)
    })

    test('Should throw error when invalidServerTestBundle.server not exist in container', async () => {
      const httpKernel = givenATestHttpKernel('invalidServerTestBundle', new InvalidServerTestBundle())
      const configMock = jest.spyOn(config.util, 'toObject')
      configMock.mockReturnValueOnce({
        invalidServerTestBundle: {
          port: 42
        }
      })

      const promise = httpKernel.startServer()

      const expectedError = new HttpKernelError('HttpKernel requires invalidServerTestBundle.server in container')
      await expect(promise).rejects.toThrowError(expectedError)
    })

    test('Should load server from container using configured port', async () => {
      const httpKernel = givenATestHttpKernel('serverTestBundle', new ServerTestBundle())
      const configMock = jest.spyOn(config.util, 'toObject')
      configMock.mockReturnValueOnce({
        serverTestBundle: {
          port: 23
        }
      })
      await httpKernel.boot()
      const container = httpKernel.getContainer()
      const mockedServer = container.get<HttpServer>('serverTestBundle.server')
  
      await httpKernel.startServer()
  
      expect(mockedServer.start).toHaveBeenCalledTimes(1)
      expect(mockedServer.start).toHaveBeenCalledWith(23)
    })
  })
})
