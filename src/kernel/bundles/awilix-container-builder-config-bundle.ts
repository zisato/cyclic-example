import { InjectionMode, AwilixContainer, InjectionModeType } from 'awilix'
import joi, { ObjectSchema } from 'joi'
import { AbstractBundle } from '../bundle/abstract-bundle'
import { Configuration } from '../container/configuration'

export class AxilixContainerBuilderConfigBundle extends AbstractBundle {
  name (): string {
    return 'container'
  }

  configSchema (): ObjectSchema | null {
    return joi.object({
      loadModules: joi.array().items(joi.string()).default([]),
      injectionMode: joi.string().valid(...Object.keys(InjectionMode)).default(InjectionMode.CLASSIC)
    })
  }

  loadContainer (containerBuilder: AwilixContainer, bundleConfiguration: Configuration): void {
    containerBuilder.options.injectionMode = bundleConfiguration.get<InjectionModeType>('container.injectionMode')
    containerBuilder.loadModules(bundleConfiguration.get<string[]>('container.loadModules'), {
      formatName: 'camelCase'
    })
  }
}
