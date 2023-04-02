import { Container } from '../../../src/kernel/container/container'
import { NextFunction, Response, Router } from 'express'
import { RouteLoader } from '../../../src/kernel/bundles/express-server-bundle'
import CreateProductController from '../../../src/infrastructure/product/controller/create-product-controller'
import { AuthRequest } from '../../../src/infrastructure/express/auth-request'

export class ProductRouteLoader implements RouteLoader {
    loadRoutes(container: Container): Router[] {
        const router = Router()

        const createProductController = container.getTyped(CreateProductController)

        router.post(
            '/admin/products',
            async (req: AuthRequest, res: Response, next: NextFunction) => {
                try {
                    await createProductController.handle(req, res)
                } catch (error) {
                    next(error)
                }
            }
        )

        return [router]
    }
}
