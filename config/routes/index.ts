import { Container } from '../../src/kernel/container/container'
import { Router } from 'express'
import { RouteLoader } from '../../src/kernel/bundles/express-server-bundle'
import IndexController from '../../src/infrastructure/controller/index-controller'

export class IndexRouteLoader implements RouteLoader {
    loadRoutes (container: Container): Router[] {
        const router = Router()

        const indexController = container.getTyped(IndexController)
        router.get('/', indexController.handle)

        return [router]
    }
}