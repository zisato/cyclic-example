import { Container } from '../../../src/simple-kernel/container/container'
import { NextFunction, Request, Response, Router } from 'express'
import { RouterConfiguration } from '../../../src/simple-kernel/configuration/router-configuration'
import AddItemController from '../../../src/infrastructure/order/controller/add-item-controller'
import CustomerAuthenticatedMiddleware from '../../../src/infrastructure/express/middleware/customer-authenticated-middleware'

export class CartRouterConfiguration implements RouterConfiguration {
    getRoutersConfiguration(container: Container): Router[] {
        const router = Router()

        const customerAuthenticatedMiddleware = container.getTyped(CustomerAuthenticatedMiddleware)
        const addItemController = container.getTyped(AddItemController)

        router.post(
            '/cart/items',
            customerAuthenticatedMiddleware.handle,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    await addItemController.handle(req, res)
                } catch (error) {
                    next(error)
                }
            }
        )

        return [router]
    }
}
