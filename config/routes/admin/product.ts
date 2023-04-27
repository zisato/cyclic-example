import { Container } from '../../../src/simple-kernel/container/container'
import { NextFunction, Request, Response, Router } from 'express'
import { RouterConfiguration } from '../../../src/simple-kernel/configuration/router-configuration'
import CreateProductController from '../../../src/infrastructure/product/controller/admin/create-product-controller'
import ListProductsController from '../../../src/infrastructure/product/controller/admin/list-products-controller'
import UpdateProductController from '../../../src/infrastructure/product/controller/admin/update-product-controller'
import SellerAuthenticatedMiddleware from '../../../src/infrastructure/express/middleware/seller-authenticated-middleware'
/*
const checkAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}
*/
export class ProductRouteLoader implements RouterConfiguration {
    getRoutersConfiguration(container: Container): Router[] {
        const router = Router()

        const sellerAuthenticatedMiddleware = container.getTyped(SellerAuthenticatedMiddleware)
        const createProductController = container.getTyped(CreateProductController)
        const listProductsController = container.get<ListProductsController>('adminListProductsController')
        const updateProductController = container.getTyped(UpdateProductController)
        
        router.get(
            '/admin/products/create',
            sellerAuthenticatedMiddleware.handle,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    await createProductController.handle(req, res)
                } catch (error) {
                    next(error)
                }
            }
        )

        router.post(
            '/admin/products/create',
            sellerAuthenticatedMiddleware.handle,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    await createProductController.handle(req, res)
                } catch (error) {
                    next(error)
                }
            }
        )

        router.get(
            '/admin/products/:productId/update',
            sellerAuthenticatedMiddleware.handle,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    await updateProductController.handle(req, res)
                } catch (error) {
                    next(error)
                }
            }
        )

        router.post(
            '/admin/products/:productId/update',
            sellerAuthenticatedMiddleware.handle,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    await updateProductController.handle(req, res)
                } catch (error) {
                    next(error)
                }
            }
        )

        router.get(
            '/admin/products',
            sellerAuthenticatedMiddleware.handle,
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
