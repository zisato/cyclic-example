import { AwilixContainer } from 'awilix'
import { Parameters } from '../parameters/parameters'

export interface ContainerConfiguration {
    configureContainer(container: AwilixContainer, parameters: Parameters): void
}
