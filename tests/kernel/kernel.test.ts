import { asValue, AwilixContainer } from 'awilix'
import config from 'config'
import Joi, { ObjectSchema } from 'joi'
import { AbstractBundle } from '../../src/kernel/bundle/abstract-bundle'
import { Bundle } from '../../src/kernel/bundle/bundle'
import { Configuration } from '../../src/kernel/container/configuration'
import { BundleConfigurationRequiredError } from '../../src/kernel/exception/bundle-configuration-required-error'
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
  bundles (): Bundle[] {
    return [
      new NullConfigTestBundle(),
      new TestBundle()
    ]
  }
}

class DuplicatedBundlesTestKernel extends Kernel {
  bundles (): Bundle[] {
    return [
      new TestBundle(),
      new TestBundle()
    ]
  }
}

describe('Kernel unit test suite', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('Should throw error when getConfiguration in non booted kernel', () => {
    const kernel = new TestKernel()

    expect(() => {
      kernel.getConfiguration()
    }).toThrow(KernelError)
  })

  test('Should throw error when getContainer in non booted kernel', () => {
    const kernel = new TestKernel()

    expect(() => {
      kernel.getContainer()
    }).toThrow(KernelError)
  })

  test('Should throw error when duplicated bundle names', async () => {
    const configMock = jest.spyOn(config.util, 'toObject')
    configMock.mockReturnValueOnce({
      testBundle: {}
    })

    const kernel = new DuplicatedBundlesTestKernel()

    const promise = kernel.boot()

    await expect(promise).rejects.toThrowError(BundleNameDuplicatedError)
  })

  test('Should return bundles', () => {
    const kernel = new TestKernel()
    const configMock = jest.spyOn(config.util, 'toObject')
    configMock.mockReturnValueOnce({
      testBundle: {}
    })

    const bundles = kernel.bundles()

    expect(bundles.length).toEqual(2)
  })

  describe('loadConfig', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    test('Should load config from bundles igoring rest', async () => {
      const kernel = new TestKernel()
      const configMock = jest.spyOn(config.util, 'toObject')
      configMock.mockReturnValueOnce({
        ignoreProperty: true,
        testBundle: {}
      })

      await kernel.boot()
      const configuration = kernel.getConfiguration()

      expect(configuration.has('ignoreProperty')).toBeFalsy()
      expect(configuration.has('testBundle.property')).toBeTruthy()
    })

    test('Should use default value', async () => {
      const kernel = new TestKernel()
      const configMock = jest.spyOn(config.util, 'toObject')
      configMock.mockReturnValueOnce({
        testBundle: {}
      })

      await kernel.boot()
      const configuration = kernel.getConfiguration()

      expect(configuration.get('testBundle.property')).toEqual('testBundleProperty')
    })

    test('Should use configured value', async () => {
      const kernel = new TestKernel()
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

    test('When bundle config not null and not in config file throw error', async () => {
      const kernel = new TestKernel()
      const configMock = jest.spyOn(config.util, 'toObject')
      configMock.mockReturnValueOnce({})

      const promise = kernel.boot()

      await expect(promise).rejects.toThrowError(BundleConfigurationRequiredError)
    })

    test('When bundle config error validation throw error', async () => {
      const kernel = new TestKernel()
      const configMock = jest.spyOn(config.util, 'toObject')
      configMock.mockReturnValueOnce({
        testBundle: {
          property: 12345
        }
      })

      const promise = kernel.boot()

      await expect(promise).rejects.toThrowError(BundleConfigurationValidationError)
    })
  })

  describe('loadContainer', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    test('Should load bundles container', async () => {
      const kernel = new TestKernel()
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
      const kernel = new TestKernel()
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
      const kernel = new TestKernel()
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
