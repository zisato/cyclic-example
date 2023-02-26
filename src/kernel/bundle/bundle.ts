import { AwilixContainer } from 'awilix'
import { ObjectSchema } from 'joi'
import { Configuration } from '../container/configuration'
import { Container } from '../container/container'
import { Json } from '../container/json-configuration'

export interface Bundle {
  name: () => string
  configSchema: () => ObjectSchema | null
  loadContainer: (containerBuilder: AwilixContainer, bundleConfiguration: Configuration) => void
  boot: (container: Container, configuration: Configuration) => void
  prependConfig: (configuration: Configuration) => Promise<Json>
  shutdown: (container: Container) => Promise<void>
}
