import { Container } from '../../../src/simple-kernel/container/container'
import { NextFunction, Request, Response, Router } from 'express'
import { RouterConfiguration } from '../../../src/simple-kernel/configuration/router-configuration'
import ListStoreController from '../../../src/infrastructure/store/controller/list-store-controller'
import CustomerAuthenticatedMiddleware from '../../../src/infrastructure/express/middleware/customer-authenticated-middleware'

export class StoreRouterConfiguration implements RouterConfiguration {
    getRoutersConfiguration(container: Container): Router[] {
        const router = Router()

        const customerAuthenticatedMiddleware = container.getTyped(CustomerAuthenticatedMiddleware)
        const listStoreController = container.getTyped(ListStoreController)

        router.get(
            '/stores',
            customerAuthenticatedMiddleware.handle, 
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    await listStoreController.handle(req, res)
                } catch (error) {
                    next(error)
                }
            }
        )

        return [router]
    }
}
