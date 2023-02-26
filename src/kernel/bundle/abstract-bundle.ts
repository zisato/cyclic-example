import { AwilixContainer } from 'awilix'
import { ObjectSchema } from 'joi'
import { Configuration } from '../container/configuration'
import { Container } from '../container/container'
import { Json } from '../container/json-configuration'
import { Bundle } from './bundle'

export abstract class AbstractBundle implements Bundle {
  configSchema (): ObjectSchema | null {
    return null
  }

  boot (_container: Container, _configuration: Configuration): void {}

  loadContainer (_containerBuilder: AwilixContainer, _bundleConfiguration: Configuration): void {}

  async prependConfig (_configuration: Configuration): Promise<Json> {
    return {}
  }

  async shutdown (_container: Container): Promise<void> {}

  abstract name (): string
}
