import { Container } from '../../src/kernel/container/container'
import { NextFunction, Request, Response, Router } from 'express'
import { RouteLoader } from '../../src/kernel/bundles/express-server-bundle'
import ListProductsController from '../../src/infrastructure/product/controller/list-products-controller'

export class ProductRouteLoader implements RouteLoader {
    loadRoutes(container: Container): Router[] {
        const router = Router()

        const listProductsController = container.getTyped(ListProductsController)

        router.get(
            '/stores/:storeId/products',
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
