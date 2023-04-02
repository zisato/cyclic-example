import { asValue, AwilixContainer } from 'awilix'
import config from 'config'
import Joi, { ObjectSchema } from 'joi'
import { AbstractBundle } from '../../src/kernel/bundle/abstract-bundle'
import { Bundle } from '../../src/kernel/bundle/bundle'
import { Configuration } from '../../src/kernel/container/configuration'
import { BundleConfigurationNotExistsError } from '../../src/kernel/exception/bundle-configuration-not-exists-error'
// import { BundleConfigurationRequiredError } from '../../src/kernel/exception/bundle-configuration-required-error'
import { BundleConfigurationValidationError } from '../../src/kernel/exception/bundle-configuration-validation-error'
import { BundleNameDuplicatedError } from '../../src/kernel/exception/bundle-name-duplicated-error'
import { KernelError } from '../../src/kernel/exception/kernel-error'
import { Kernel } from '../../src/kernel/kernel'

class TestBundle extends AbstractBundle {
  name (): string {
    return 'testBundle'
  }

  configSchema (): ObjectSchema<any> | null {
    return Joi.object({
      property: Joi.string().default('testBundleProperty')
    })
  }

  loadContainer (containerBuilder: AwilixContainer, bundleConfiguration: Configuration): void {
    containerBuilder.register('testBundle.property', asValue(bundleConfiguration.get<string>('testBundle.property')))
  }
}

class NullConfigTestBundle extends AbstractBundle {
  name (): string {
    return 'nullConfigTestBundle'
  }
}

class TestKernel extends Kernel {
  constructor (private readonly loadedBundles: Bundle[]) {
    super()
  }

  registerBundles (): Bundle[] {
    return this.loadedBundles
  }
}

describe('Kernel unit test suite', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  function givenATestKernel(bundles: Bundle[] | null = null): TestKernel {
    bundles = bundles ?? [
      new NullConfigTestBundle(),
      new TestBundle()
    ]
    return new TestKernel(bundles)
  }

  test('Should throw error when getConfiguration in non booted kernel', () => {
    const kernel = givenATestKernel()

    expect(() => {
      kernel.getConfiguration()
    }).toThrow(KernelError)
  })

  test('Should throw error when getContainer in non booted kernel', () => {
    const kernel = givenATestKernel()

    expect(() => {
      kernel.getContainer()
    }).toThrow(KernelError)
  })

  test('Should throw error when duplicated bundle names', async () => {
    const configMock = jest.spyOn(config.util, 'toObject')
    configMock.mockReturnValueOnce({
      testBundle: {}
    })

    const kernel = givenATestKernel([
      new TestBundle(),
      new TestBundle()
    ])

    const promise = kernel.boot()

    void expect(promise).rejects.toThrowError(BundleNameDuplicatedError)
  })

  describe('loadConfig', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    test('Should throw error when bundle config not exists', async () => {
      const configMock = jest.spyOn(config.util, 'toObject')
      configMock.mockReturnValueOnce({
        testBundle: {},
        notExistsBundle: {}
      })
  
      const kernel = givenATestKernel()
  
      const promise = kernel.boot()
  
      void expect(promise).rejects.toThrowError(BundleConfigurationNotExistsError)
    })

    test('Should load config from bundles', async () => {
      const kernel = givenATestKernel()
      const configMock = jest.spyOn(config.util, 'toObject')
      configMock.mockReturnValueOnce({
        testBundle: {}
      })

      await kernel.boot()
      const configuration = kernel.getConfiguration()

      expect(configuration.has('testBundle.property')).toBeTruthy()
    })

    test('Should use default value', async () => {
      const kernel = givenATestKernel()
      const configMock = jest.spyOn(config.util, 'toObject')
      configMock.mockReturnValueOnce({
        testBundle: {}
      })

      await kernel.boot()
      const configuration = kernel.getConfiguration()

      expect(configuration.get('testBundle.property')).toEqual('testBundleProperty')
    })

    test('Should use configured value', async () => {
      const kernel = givenATestKernel()
      const configMock = jest.spyOn(config.util, 'toObject')
      configMock.mockReturnValueOnce({
        testBundle: {
          property: 'newTestBundleProperty'
        }
      })

      await kernel.boot()
      const configuration = kernel.getConfiguration()

      expect(configuration.get('testBundle.property')).toEqual('newTestBundleProperty')
    })

    test('When bundle config not null with default values and not in config should use default values', async () => {
      const kernel = givenATestKernel()
      const configMock = jest.spyOn(config.util, 'toObject')
      configMock.mockReturnValueOnce({})

      await kernel.boot()
      const configuration = kernel.getConfiguration()

      expect(configuration.get('container.loadModules')).toEqual({ patterns: [], injectionMode: 'CLASSIC', lifetime: 'SCOPED' })
    })

    test('When bundle config error validation throw error', async () => {
      const kernel = givenATestKernel()
      const configMock = jest.spyOn(config.util, 'toObject')
      configMock.mockReturnValueOnce({
        testBundle: {
          property: 12345
        }
      })

      const promise = kernel.boot()

      void expect(promise).rejects.toThrowError(BundleConfigurationValidationError)
    })
  })

  describe('loadContainer', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    test('Should load bundles container', async () => {
      const kernel = givenATestKernel()
      const configMock = jest.spyOn(config.util, 'toObject')
      configMock.mockReturnValueOnce({
        testBundle: {}
      })

      await kernel.boot()
      const container = kernel.getContainer()

      expect(container.get('testBundle.property')).toEqual('testBundleProperty')
    })
  })

  describe('shutdown', () => {
    test('set configuration as null', async () => {
      const kernel = givenATestKernel()
      const configMock = jest.spyOn(config.util, 'toObject')
      configMock.mockReturnValueOnce({
        testBundle: {}
      })
      await kernel.boot()

      await kernel.shutdown()

      expect(() => {
        kernel.getConfiguration()
      }).toThrow(KernelError)
    })

    test('set container as null', async () => {
      const kernel = givenATestKernel()
      const configMock = jest.spyOn(config.util, 'toObject')
      configMock.mockReturnValueOnce({
        testBundle: {}
      })
      await kernel.boot()

      await kernel.shutdown()

      expect(() => {
        kernel.getContainer()
      }).toThrow(KernelError)
    })
  })
})
