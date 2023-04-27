import { Container } from '../../../src/simple-kernel/container/container'
import { NextFunction, Request, Response, Router } from 'express'
import { RouterConfiguration } from '../../../src/simple-kernel/configuration/router-configuration'
import UpdateStoreController from '../../../src/infrastructure/store/controller/admin/update-store-controller'
import SellerAuthenticatedMiddleware from '../../../src/infrastructure/express/middleware/seller-authenticated-middleware'

/*
const checkAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}
*/
export class StoreRouteLoader implements RouterConfiguration {
    getRoutersConfiguration(container: Container): Router[] {
        const router = Router()

        const sellerAuthenticatedMiddleware = container.getTyped(SellerAuthenticatedMiddleware)
        const updateStoreController = container.getTyped(UpdateStoreController)
        
        router.get(
            '/admin/stores/update',
            sellerAuthenticatedMiddleware.handle,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    await updateStoreController.handle(req, res)
                } catch (error) {
                    next(error)
                }
            }
        )
        router.post(
            '/admin/stores/update',
            sellerAuthenticatedMiddleware.handle,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    await updateStoreController.handle(req, res)
                } catch (error) {
                    next(error)
                }
            }
        )

        return [router]
    }
}
