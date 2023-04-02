import { Container } from '../../src/kernel/container/container'
import { NextFunction, Request, Response, Router } from 'express'
import { RouteLoader } from '../../src/kernel/bundles/express-server-bundle'
import ListStoreController from '../../src/infrastructure/store/controller/list-store-controller'

export class StoreRouteLoader implements RouteLoader {
    loadRoutes(container: Container): Router[] {
        const router = Router()

        const listStoreController = container.getTyped(ListStoreController)

        router.get('/stores', async (req: Request, res: Response, next: NextFunction) => {
            try {
                await listStoreController.handle(req, res)
            } catch (error) {
                next(error)
            }
        })

        return [router]
    }
}
