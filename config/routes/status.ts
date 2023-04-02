import { Container } from '../../src/kernel/container/container'
import { Router } from 'express'
import { RouteLoader } from '../../src/kernel/bundles/express-server-bundle'
import StatusController from '../../src/infrastructure/controller/status-controller'

export class StatusRouteLoader implements RouteLoader {
    loadRoutes(container: Container): Router[] {
        const router = Router()

        const statusController = container.getTyped(StatusController)
        router.get('/status', statusController.handle)

        return [router]
    }
}