import { Request, Response, NextFunction } from 'express'
import CreateDemo from '../../../application/demo/create/create-demo'

export default class CustomerAuthenticatedMiddleware {
    handle = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        req.user = { id: CreateDemo.FIXTURES.customer.id }

        next()
    }
}
