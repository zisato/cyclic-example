import { Container } from '../../../src/simple-kernel/container/container'
import { NextFunction, Request, Response, Router } from 'express'
import { RouterConfiguration } from '../../../src/simple-kernel/configuration/router-configuration'
import ListSellersController from '../../../src/infrastructure/seller/controller/list-sellers-controller'

export class SellerRouterConfiguration implements RouterConfiguration {
    getRoutersConfiguration(container: Container): Router[] {
        const router = Router()

        const listSellersController = container.getTyped(ListSellersController)

        router.get('/sellers', async (req: Request, res: Response, next: NextFunction) => {
            try {
                await listSellersController.handle(req, res)
            } catch (error) {
                next(error)
            }
        })

        return [router]
    }
}
