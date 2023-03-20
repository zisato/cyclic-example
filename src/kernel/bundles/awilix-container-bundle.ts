import { InjectionMode, AwilixContainer, InjectionModeType, Lifetime, LifetimeType } from 'awilix'
import joi, { ObjectSchema } from 'joi'
import { AbstractBundle } from '../bundle/abstract-bundle'
import { Configuration } from '../container/configuration'

export class AxilixContainerBundle extends AbstractBundle {
  name (): string {
    return 'container'
  }

  configSchema (): ObjectSchema | null {
    const lifetimeAllowedValues = Object.keys(Lifetime)
    const injectionModeAllowedValues = Object.keys(InjectionMode)
    const resolverOptionsSchema = joi.object({
      lifetime: joi.string().valid(...lifetimeAllowedValues).default(Lifetime.SCOPED)
    })
    const shorthandLifetimeOptionsSchema = joi.array().items(joi.string(), ...lifetimeAllowedValues)
    const patternsSchema = joi.array().items(joi.string(), shorthandLifetimeOptionsSchema, resolverOptionsSchema)

    return joi.object({
      injectionMode: joi.string().valid(...injectionModeAllowedValues).default(InjectionMode.CLASSIC),
      loadModules: joi.object({
        patterns: joi.array().items(joi.string(), patternsSchema).default([]),
        lifetime: joi.string().valid(...lifetimeAllowedValues).default(Lifetime.SCOPED),
        injectionMode: joi.string().valid(...injectionModeAllowedValues).default(InjectionMode.CLASSIC)
      }).default()
    })
  }

  loadContainer (containerBuilder: AwilixContainer, bundleConfiguration: Configuration): void {
    containerBuilder.loadModules(bundleConfiguration.get<string[]>('container.loadModules.patterns'), {
      formatName: 'camelCase',
      resolverOptions: {
        lifetime: bundleConfiguration.get<LifetimeType>('container.loadModules.lifetime'),
        injectionMode: bundleConfiguration.get<InjectionModeType>('container.loadModules.injectionMode')
      }
    })
  }
}
