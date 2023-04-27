import { Container } from '../../src/simple-kernel/container/container'
import { NextFunction, Request, Response, Router } from 'express'
import { RouterConfiguration } from '../../src/simple-kernel/configuration/router-configuration'
import ListProductsController from '../../src/infrastructure/product/controller/list-products-controller'
import CustomerAuthenticatedMiddleware from '../../src/infrastructure/express/middleware/customer-authenticated-middleware'

export class ProductRouteLoader implements RouterConfiguration {
    getRoutersConfiguration(container: Container): Router[] {
        const router = Router()

        const customerAuthenticatedMiddleware = container.getTyped(CustomerAuthenticatedMiddleware)
        const listProductsController = container.getTyped(ListProductsController)

        router.get(
            '/stores/:storeId/products',
            customerAuthenticatedMiddleware.handle,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    await listProductsController.handle(req, res)
                } catch (error) {
                    next(error)
                }
            }
        )

        return [router]
    }
}
