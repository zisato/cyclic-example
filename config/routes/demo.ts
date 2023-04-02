import { Container } from '../../src/kernel/container/container'
import { Router } from 'express'
import { RouteLoader } from '../../src/kernel/bundles/express-server-bundle'
import DemoController from '../../src/infrastructure/controller/demo-controller'

export class DemoRouteLoader implements RouteLoader {
    loadRoutes(container: Container): Router[] {
        const router = Router()

        const demoController = container.getTyped(DemoController)
        router.post('/demo', demoController.handle)

        return [router]
    }
}