import { Request, Response, NextFunction } from 'express'
import CreateDemo from '../../../application/demo/create/create-demo'
import { RequestHandlerMiddleware } from '../../../kernel/bundles/express-server-bundle'
import { AuthRequest } from '../auth-request'

export default class DemoUserAuthenticatedMiddleware implements RequestHandlerMiddleware {
    handle = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        (req as AuthRequest).user = { id: CreateDemo.FIXTURES.seller.id }

        next()
    }
}
