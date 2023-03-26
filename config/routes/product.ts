import { Container } from '../../src/kernel/container/container'
import { NextFunction, Request, Response, Router } from 'express'
import { RouteLoader } from '../../src/kernel/bundles/express-server-bundle'
import CreateProductController from '../../src/infrastructure/product/controller/create-product-controller'
import { AuthRequest } from '../../src/infrastructure/express/auth-request'
import UserAuthenticatedMiddleware from '../../src/infrastructure/express/middleware/user-authenticated-middleware'

export class ProductRouteLoader implements RouteLoader {
    loadRoutes (container: Container): Router[] {
        const router = Router()

        const createProductController = container.getTyped(CreateProductController)
        const userAuthenticatedMiddleware = container.getTyped(UserAuthenticatedMiddleware)
        
        router.post(
            '/products',
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    await userAuthenticatedMiddleware.handle(req, res, next)
                } catch (error) {
                    next(error)
                }
            },
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
