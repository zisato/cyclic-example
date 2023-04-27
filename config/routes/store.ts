import { Container } from '../../src/simple-kernel/container/container'
import { NextFunction, Request, Response, Router } from 'express'
import { RouterConfiguration } from '../../src/simple-kernel/configuration/router-configuration'
import ListStoreController from '../../src/infrastructure/store/controller/list-store-controller'

export class StoreRouteLoader implements RouterConfiguration {
    getRoutersConfiguration(container: Container): Router[] {
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
