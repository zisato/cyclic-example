import cors from 'cors'
import express, { RequestHandler } from 'express'
import { Container } from '../../src/simple-kernel/container/container'
import { Parameters } from '../../src/simple-kernel/parameters/parameters'
import { MiddlewareConfiguration } from '../../src/simple-kernel/configuration/middleware-configuration'

export class AppMiddlewareConfiguration implements MiddlewareConfiguration {
    getMiddlewaresConfiguration(_container: Container, parameters: Parameters): RequestHandler[] {
        return [
            cors(),
            express.json(),
            express.urlencoded({ extended: true }),
            express.static(parameters.get<string>('express.middlewares.static.dir'))
        ]
    }
}
