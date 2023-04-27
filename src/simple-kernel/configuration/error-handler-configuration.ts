import { ErrorRequestHandler } from 'express'
import { Container } from '../container/container'
import { Parameters } from '../parameters/parameters'

export interface ErrorHandlerConfiguration {
    getErrorHandlersConfiguration(container: Container, parameters: Parameters): ErrorRequestHandler[]
}
