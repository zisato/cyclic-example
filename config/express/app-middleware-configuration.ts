import cors from 'cors'
import express, { RequestHandler } from 'express'
import { Container } from '../../src/simple-kernel/container/container'
import { Parameters } from '../../src/simple-kernel/parameters/parameters'
import { MiddlewareConfiguration } from '../../src/simple-kernel/configuration/middleware-configuration'
import fileUpload from 'express-fileupload'
import methodOverride from 'method-override'

export class AppMiddlewareConfiguration implements MiddlewareConfiguration {
    getMiddlewaresConfiguration(_container: Container, parameters: Parameters): RequestHandler[] {
        return [
            fileUpload({ parseNested: true }),
            cors(),
            express.json(),
            express.urlencoded({ extended: true }),
            methodOverride((req, _res) => {
                if (req.method === 'POST' && req.body && typeof req.body === 'object' && '_method' in req.body) {
                    const method = req.body._method
                    delete req.body._method

                    return method
                }
            }),
            express.static(parameters.get<string>('express.middlewares.static.dir'))
        ]
    }
}
