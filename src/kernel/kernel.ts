import config from 'config'
import { Container } from './container/container'
import { createContainer } from 'awilix'
import { Configuration } from './container/configuration'
import { Json, JsonConfiguration } from './container/json-configuration'
import { Bundle } from './bundle/bundle'
import { BundleConfigurationRequiredError } from './exception/bundle-configuration-required-error'
import { BundleConfigurationValidationError } from './exception/bundle-configuration-validation-error'
import { KernelError } from './exception/kernel-error'
import { BundleNameDuplicatedError } from './exception/bundle-name-duplicated-error'
import { AwilixContainer } from './container/awilix-container'

export abstract class Kernel {
  protected isBooted: boolean = false
  private configuration: Configuration | null = null
  private container: Container | null = null

  async boot (): Promise<void> {
    if (!this.isBooted) {
      this.ensureUniqueBundleName()

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

  bundles (): Bundle[] {
    return []
  }

  async preShutdown (): Promise<void> {}

  private async loadConfiguration (): Promise<Configuration> {
    const currentConfiguration = config.util.toObject()
    const prependConfiguration = await this.loadBundlesPrependConfiguration(currentConfiguration)
    const configuration = config.util.extendDeep({}, currentConfiguration, prependConfiguration)
    const bundlesConfiguration = this.loadBundlesConfiguration(configuration)

    return new JsonConfiguration(config.util.extendDeep({}, bundlesConfiguration))
  }

  private loadContainer (configuration: Configuration): Container {
    const container = createContainer()

    this.bundles().forEach((bundle: Bundle) => {
      bundle.loadContainer(container, configuration)
    })

    return new AwilixContainer(container)
  }

  private bootBundles (container: Container, configuration: Configuration): void {
    this.bundles().forEach((bundle: Bundle) => {
      bundle.boot(container, configuration)
    })
  }

  private async shutdownBundles (): Promise<void> {
    const container = this.getContainer()

    for (const bundle of this.bundles()) {
      await bundle.shutdown(container)
    }
  }

  private async loadBundlesPrependConfiguration (currentConfiguration: Configuration): Promise<Json> {
    let result = {}

    for (const bundle of this.bundles()) {
      const prependConfig = await bundle.prependConfig(currentConfiguration)
      result = { ...result, ...prependConfig }
    }

    return result
  }

  private loadBundlesConfiguration (currentConfig: Json): Json {
    return this.bundles().reduce((acc, bundle) => {
      const configSchema = bundle.configSchema()
      if (configSchema === null) {
        return acc
      }

      if (!(bundle.name() in currentConfig)) {
        throw new BundleConfigurationRequiredError(`Bundle ${bundle.name()} requires a config schema`)
      }

      const { value: bundleConfig, error } = configSchema.validate(currentConfig[bundle.name()])

      if (error !== undefined) {
        throw new BundleConfigurationValidationError(`Bundle ${bundle.name()} config validation error: ${error.message}`)
      }

      return { ...acc, [bundle.name()]: { ...bundleConfig } }
    }, {})
  }

  private ensureUniqueBundleName (): void {
    const bundleNames = this.bundles().map((bundle: Bundle) => {
      return bundle.name()
    })

    let existingBundleNames = {}
    bundleNames.forEach((bundleName: string) => {
      if (bundleName in existingBundleNames) {
        throw new BundleNameDuplicatedError(`Trying to load two bundles with same name ${bundleName}`)
      }

      existingBundleNames = { ...existingBundleNames, [bundleName]: true }
    })
  }
}
