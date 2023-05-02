import { Container } from '../../../src/simple-kernel/container/container'
import { NextFunction, Request, Response, Router } from 'express'
import { RouterConfiguration } from '../../../src/simple-kernel/configuration/router-configuration'
import SellerAuthenticatedMiddleware from '../../../src/infrastructure/express/middleware/seller-authenticated-middleware'
import ListOrdersController from '../../../src/infrastructure/order/controller/admin/list-orders-controller'

/*
const checkAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}
*/
export class OrderRouteLoader implements RouterConfiguration {
    getRoutersConfiguration(container: Container): Router[] {
        const router = Router()

        const sellerAuthenticatedMiddleware = container.getTyped(SellerAuthenticatedMiddleware)
        const listOrdersController = container.getTyped(ListOrdersController)
        
        router.get(
            '/admin/orders',
            sellerAuthenticatedMiddleware.handle,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    await listOrdersController.handle(req, res)
                } catch (error) {
                    next(error)
                }
            }
        )

        return [router]
    }
}
