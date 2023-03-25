import config from 'config'
import { Container } from './container/container'
import { createContainer } from 'awilix'
import { Configuration } from './container/configuration'
import { Json, JsonConfiguration } from './container/json-configuration'
import { Bundle } from './bundle/bundle'
import { BundleConfigurationNotExistsError } from './exception/bundle-configuration-not-exists-error'
import { BundleConfigurationValidationError } from './exception/bundle-configuration-validation-error'
import { KernelError } from './exception/kernel-error'
import { BundleNameDuplicatedError } from './exception/bundle-name-duplicated-error'
import { AwilixContainer } from './container/awilix-container'
import { AxilixContainerBundle } from './bundles/awilix-container-bundle'

export abstract class Kernel {
  protected isBooted: boolean = false
  private bundles: Bundle[] = []
  private configuration: Configuration | null = null
  private container: Container | null = null

  abstract registerBundles (): Bundle[]

  async boot (): Promise<void> {
    if (!this.isBooted) {
      this.loadBundles()

      const configuration = await this.loadConfiguration()
      const container = this.loadContainer(configuration)
      this.bootBundles(container, configuration)

      this.configuration = configuration
      this.container = container
      this.isBooted = true
    }
  }

  async shutdown (): Promise<void> {
    if (this.isBooted) {
      await this.preShutdown()
      await this.shutdownBundles()

      this.configuration = null
      this.container = null
      this.isBooted = false
    }
  }

  getConfiguration (): Configuration {
    if (this.configuration === null) {
      throw new KernelError('Cannot get configuration from non booted app')
    }

    return this.configuration
  }

  getContainer (): Container {
    if (this.container === null) {
      throw new KernelError('Cannot get container from non booted app')
    }

    return this.container
  }

  async preShutdown (): Promise<void> {}

  private loadBundles (): void {
    this.bundles = []
    const existingBundleNames: string[] = []
    const registerBundles: Bundle[] = [
      new AxilixContainerBundle(),
      ...this.registerBundles()
    ]
    registerBundles.forEach((bundle: Bundle) => {
      const bundleName = bundle.name()
      if (existingBundleNames.includes(bundleName)) {
        throw new BundleNameDuplicatedError(`Trying to load two bundles with same name ${bundleName}`)
      }

      existingBundleNames.push(bundleName)
      this.bundles.push(bundle)
    })
  }

  private async loadConfiguration (): Promise<Configuration> {
    const currentConfiguration = config.util.toObject()
    this.ensureConfigurationExistsInBundles(currentConfiguration)
    const prependConfiguration = await this.loadBundlesPrependConfiguration(currentConfiguration)
    const configuration = config.util.extendDeep({}, currentConfiguration, prependConfiguration)
    const bundlesConfiguration = this.loadBundlesConfiguration(configuration)

    return new JsonConfiguration(config.util.extendDeep({}, bundlesConfiguration))
  }

  private loadContainer (configuration: Configuration): Container {
    const container = createContainer({
      injectionMode: configuration.get('container.injectionMode')
    })

    this.bundles.forEach((bundle: Bundle) => {
      bundle.loadContainer(container, configuration)
    })

    return new AwilixContainer(container)
  }

  private bootBundles (container: Container, configuration: Configuration): void {
    this.bundles.forEach((bundle: Bundle) => {
      bundle.boot(container, configuration)
    })
  }

  private async shutdownBundles (): Promise<void> {
    const container = this.getContainer()

    for (const bundle of this.bundles) {
      await bundle.shutdown(container)
    }
  }

  private async loadBundlesPrependConfiguration (currentConfiguration: Configuration): Promise<Json> {
    let result = {}

    for (const bundle of this.bundles) {
      const prependConfig = await bundle.prependConfig(currentConfiguration)
      result = { ...result, ...prependConfig }
    }

    return result
  }

  private loadBundlesConfiguration (config: Json): Json {
    return this.bundles.reduce((acc, bundle) => {
      let configSchema = bundle.configSchema()
      if (configSchema === null) {
        return acc
      }

      const currentConfig = config[bundle.name()] ?? {}

      const { value: bundleConfig, error } = configSchema.validate(currentConfig)

      if (error !== undefined) {
        throw new BundleConfigurationValidationError(`Bundle ${bundle.name()} config validation error: ${error.message}`)
      }

      return { ...acc, [bundle.name()]: { ...bundleConfig } }
    }, {})
  }

  private ensureConfigurationExistsInBundles(configuration: Json): void {
    const bundleNames = this.bundles.map((bundle: Bundle) => {
      return bundle.name()
    })

    for (const bundleName in configuration) {
      if (!bundleNames.includes(bundleName)) {
        throw new BundleConfigurationNotExistsError()
      }
    }
  }
}
