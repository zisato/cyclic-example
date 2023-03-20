import { ValidationError } from 'joi'
import { AwilixContainer, InjectionMode, Lifetime } from 'awilix'
import { AxilixContainerBundle } from '../../../src/kernel/bundles/awilix-container-bundle'
import { Configuration } from '../../../src/kernel/container/configuration'

describe('AxilixContainerBundle unit test', () => {
  const bundle = new AxilixContainerBundle()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('return name', () => {
    expect(bundle.name()).toEqual('container')
  })

  describe('configSchema', () => {
    test.each([
      [
        {
          injectionMode: InjectionMode.PROXY,
          loadModules: {
            patterns: ['foo'],
            lifetime: Lifetime.TRANSIENT,
            injectionMode: InjectionMode.PROXY
          }
        },
        {
          injectionMode: InjectionMode.PROXY,
          loadModules: {
            patterns: ['foo'],
            lifetime: Lifetime.TRANSIENT,
            injectionMode: InjectionMode.PROXY
          }
        }
      ],
      [
        {
          loadModules: {
            patterns: [
              [
                'foo',
                Lifetime.SINGLETON
              ]
            ]
          }
        },
        {
          injectionMode: InjectionMode.CLASSIC,
          loadModules: {
            patterns: [
              [
                'foo',
                Lifetime.SINGLETON
              ]
            ],
            lifetime: Lifetime.SCOPED,
            injectionMode: InjectionMode.CLASSIC
          }
        }
      ],
      [
        {
          loadModules: {
            patterns: [
              [
                'foo',
                {
                  lifetime: Lifetime.SINGLETON
                }
              ]
            ]
          }
        },
        {
          injectionMode: InjectionMode.CLASSIC,
          loadModules: {
            patterns: [
              [
                'foo',
                {
                  lifetime: Lifetime.SINGLETON
                }
              ]
            ],
            lifetime: Lifetime.SCOPED,
            injectionMode: InjectionMode.CLASSIC
          }
        }
      ]
    ])('Should validate schema successfully', (configuration, expectedConfig) => {
      const schema = bundle.configSchema()

      // @ts-expect-error
      const { value: bundleConfig, error } = schema.validate(configuration)

      expect(error).toBeUndefined()
      expect(bundleConfig).toEqual(expectedConfig)
    })

    test.each([['foo'], [123], [null], [false]])('Should return error when invalid injectionMode', (injectionModeValue) => {
      const configuration = { injectionMode: [injectionModeValue] }
      const schema = bundle.configSchema()

      // @ts-expect-error
      const { error } = schema.validate(configuration)

      const expectedConfig = new ValidationError('"injectionMode" must be one of [PROXY, CLASSIC]', [], {})
      expect(error).toEqual(expectedConfig)
    })

    test.each([[123], [null], [false], [{ foo: 'bar' }]])('Should return error when invalid loadModules.patterns', (loadModulesValue) => {
      const configuration = { loadModules: { patterns: [loadModulesValue] } }
      const schema = bundle.configSchema()

      // @ts-expect-error
      const { error } = schema.validate(configuration)

      const expectedConfig = new ValidationError('"loadModules.patterns[0]" does not match any of the allowed types', [], {})
      expect(error).toEqual(expectedConfig)
    })

    test.each([['foo'], [123], [null], [false]])('Should return error when invalid loadModules.lifetime', (lifetimeValue) => {
      const configuration = { loadModules: { lifetime: [lifetimeValue] } }
      const schema = bundle.configSchema()

      // @ts-expect-error
      const { error } = schema.validate(configuration)

      const expectedConfig = new ValidationError('"loadModules.lifetime" must be one of [SINGLETON, TRANSIENT, SCOPED]', [], {})
      expect(error).toEqual(expectedConfig)
    })

    test.each([['foo'], [123], [null], [false]])('Should return error when invalid loadModules.injectionMode', (injectionModeValue) => {
      const configuration = { loadModules: { injectionMode: [injectionModeValue] } }
      const schema = bundle.configSchema()

      // @ts-expect-error
      const { error } = schema.validate(configuration)

      const expectedConfig = new ValidationError('"loadModules.injectionMode" must be one of [PROXY, CLASSIC]', [], {})
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
      },
      bundleConfiguration: {
        get: jest.fn()
      }
    }

    test('Should call bundleConfiguration.get with arguments', () => {
      stubs.bundleConfiguration.get = jest.fn().mockReturnValueOnce(['foo']).mockReturnValueOnce('TRANSIENT').mockReturnValueOnce('PROXY')

      bundle.loadContainer(stubs.containerBuilder as AwilixContainer, stubs.bundleConfiguration as Configuration)

      const expectedTimes = 3
      const expectedArguments = ['container.loadModules.patterns', 'container.loadModules.lifetime', 'container.loadModules.injectionMode']
      expect(stubs.bundleConfiguration.get).toHaveBeenCalledTimes(expectedTimes)
      expect(stubs.bundleConfiguration.get).toHaveBeenNthCalledWith(1, expectedArguments[0])
      expect(stubs.bundleConfiguration.get).toHaveBeenNthCalledWith(2, expectedArguments[1])
      expect(stubs.bundleConfiguration.get).toHaveBeenNthCalledWith(3, expectedArguments[2])
    })

    test('Should call containerBuilder.loadModules with arguments', () => {
      stubs.bundleConfiguration.get = jest.fn().mockReturnValueOnce(['foo']).mockReturnValueOnce('SCOPED').mockReturnValueOnce('PROXY')

      bundle.loadContainer(stubs.containerBuilder as AwilixContainer, stubs.bundleConfiguration as Configuration)

      const expectedTimes = 1
      const expectedArguments = [
        ['foo'],
        {
          formatName: 'camelCase',
          resolverOptions: {
            lifetime: 'SCOPED',
            injectionMode: 'PROXY',
          }
        }
      ]
      expect(stubs.containerBuilder.loadModules).toHaveBeenCalledTimes(expectedTimes)
      expect(stubs.containerBuilder.loadModules).toHaveBeenCalledWith(...expectedArguments)
    })
  })
})
