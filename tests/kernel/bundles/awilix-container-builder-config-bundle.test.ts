import { ValidationError } from 'joi'
import { AwilixContainer } from 'awilix'
import { AxilixContainerBuilderConfigBundle } from '../../../src/kernel/bundles/awilix-container-builder-config-bundle'
import { Configuration } from '../../../src/kernel/container/configuration'

describe('AxilixContainerBuilderConfigBundle unit test', () => {
  const bundle = new AxilixContainerBuilderConfigBundle()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('return name', () => {
    expect(bundle.name()).toEqual('container')
  })

  describe('configSchema', () => {
    test('Should validate schema successfully', () => {
      const configuration = { loadModules: ['foo'], injectionMode: 'PROXY' }
      const schema = bundle.configSchema()

      // @ts-expect-error
      const { value: bundleConfig, error } = schema.validate(configuration)

      const expectedConfig = { loadModules: ['foo'], injectionMode: 'PROXY' }
      expect(error).toBeUndefined()
      expect(bundleConfig).toEqual(expectedConfig)
    })

    test.each([[123], [null], [false]])('Should return error when invalid loadModules', (loadModulesValue) => {
      const configuration = { loadModules: [loadModulesValue] }
      const schema = bundle.configSchema()

      // @ts-expect-error
      const { error } = schema.validate(configuration)

      const expectedConfig = new ValidationError('"loadModules[0]" must be a string', [], {})
      expect(error).toEqual(expectedConfig)
    })

    test.each([['foo'], [123], [null], [false]])('Should return error when invalid injectionMode', (injectionModeValue) => {
      const configuration = { injectionMode: [injectionModeValue] }
      const schema = bundle.configSchema()

      // @ts-expect-error
      const { error } = schema.validate(configuration)

      const expectedConfig = new ValidationError('"injectionMode" must be one of [PROXY, CLASSIC]', [], {})
      expect(error).toEqual(expectedConfig)
    })
  })

  describe('loadContainer', () => {
    const stubs: {
      containerBuilder: Partial<AwilixContainer>
      bundleConfiguration: Partial<Configuration>
    } = {
      containerBuilder: {
        loadModules: jest.fn(),
        options: {
          injectionMode: undefined
        }
      },
      bundleConfiguration: {
        get: jest.fn()
      }
    }

    test('Should load container successfully', () => {
      stubs.bundleConfiguration.get = jest.fn().mockReturnValueOnce('CLASSIC').mockReturnValueOnce([])

      bundle.loadContainer(stubs.containerBuilder as AwilixContainer, stubs.bundleConfiguration as Configuration)

      expect(stubs.containerBuilder.options?.injectionMode).toEqual('CLASSIC')
    })

    test('Should call bundleConfiguration.get with arguments', () => {
      stubs.bundleConfiguration.get = jest.fn().mockReturnValueOnce('PROXY').mockReturnValueOnce(['foo'])

      bundle.loadContainer(stubs.containerBuilder as AwilixContainer, stubs.bundleConfiguration as Configuration)

      const expectedTimes = 2
      const expectedArguments = ['container.injectionMode', 'container.loadModules']
      expect(stubs.bundleConfiguration.get).toHaveBeenCalledTimes(expectedTimes)
      expect(stubs.bundleConfiguration.get).toHaveBeenNthCalledWith(1, expectedArguments[0])
      expect(stubs.bundleConfiguration.get).toHaveBeenNthCalledWith(2, expectedArguments[1])
    })

    test('Should call containerBuilder.loadModules with arguments', () => {
      stubs.bundleConfiguration.get = jest.fn().mockReturnValueOnce('CLASSIC').mockReturnValueOnce(['foo'])

      bundle.loadContainer(stubs.containerBuilder as AwilixContainer, stubs.bundleConfiguration as Configuration)

      const expectedTimes = 1
      const expectedArguments = [['foo'], { formatName: 'camelCase' }]
      expect(stubs.containerBuilder.loadModules).toHaveBeenCalledTimes(expectedTimes)
      expect(stubs.containerBuilder.loadModules).toHaveBeenCalledWith(...expectedArguments)
    })
  })
})
