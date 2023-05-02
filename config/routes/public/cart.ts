import { Container } from '../../../src/simple-kernel/container/container'
import { NextFunction, Request, Response, Router } from 'express'
import { RouterConfiguration } from '../../../src/simple-kernel/configuration/router-configuration'
import AddItemController from '../../../src/infrastructure/order/controller/add-item-controller'
import CustomerAuthenticatedMiddleware from '../../../src/infrastructure/express/middleware/customer-authenticated-middleware'
import CompleteOrderController from '../../../src/infrastructure/order/controller/complete-order-controller'
import RemoveItemController from '../../../src/infrastructure/order/controller/remove-item-controller'

export class CartRouterConfiguration implements RouterConfiguration {
    getRoutersConfiguration(container: Container): Router[] {
        const router = Router()

        const customerAuthenticatedMiddleware = container.getTyped(CustomerAuthenticatedMiddleware)
        const addItemController = container.getTyped(AddItemController)
        const removeItemController = container.getTyped(RemoveItemController)
        const completeOrderController = container.getTyped(CompleteOrderController)

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
        
        router.delete(
            '/cart/items/:productId',
            customerAuthenticatedMiddleware.handle,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    await removeItemController.handle(req, res)
                } catch (error) {
                    next(error)
                }
            }
        )

        router.post(
            '/cart/:orderId/complete',
            customerAuthenticatedMiddleware.handle,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    await completeOrderController.handle(req, res)
                } catch (error) {
                    next(error)
                }
            }
        )

        return [router]
    }
}
