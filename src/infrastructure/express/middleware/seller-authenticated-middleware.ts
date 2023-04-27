import { Request, Response, NextFunction } from 'express'
import CreateDemo from '../../../application/demo/create/create-demo'

export default class SellerAuthenticatedMiddleware {
    handle = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        req.user = { id: CreateDemo.FIXTURES.seller.id }

        next()
    }
}
