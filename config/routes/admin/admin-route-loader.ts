import { Container } from '../../../src/kernel/container/container'
import { Router } from 'express'
import { RouteLoader } from '../../../src/kernel/bundles/express-server-bundle'
import { CategoryRouteLoader } from './category'
import { ProductRouteLoader } from './product'

export class AdminRouteLoader implements RouteLoader {
    loadRoutes(container: Container): Router[] {
        return [
            ...(new CategoryRouteLoader().loadRoutes(container)),
            ...(new ProductRouteLoader().loadRoutes(container))
        ]
    }
}