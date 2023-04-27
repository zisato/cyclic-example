import { RequestHandler } from 'express'
import { Parameters } from '../parameters/parameters'
import { Container } from '../container/container'

export interface MiddlewareConfiguration {
    getMiddlewaresConfiguration(container: Container, parameters: Parameters): RequestHandler[]
}
