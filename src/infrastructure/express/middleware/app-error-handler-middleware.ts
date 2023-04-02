import { Request, Response, NextFunction } from 'express'
import { ErrorHandlerMiddleware } from '../../../kernel/bundles/express-server-bundle'

export default class AppErrorHandlerMiddleware implements ErrorHandlerMiddleware {
    private static readonly DEFAULT_ERROR_CODE = 500

    constructor(private readonly errorMapping: Map<string, number> = new Map<string, number>()) { }

    handle = async (err: Error, _req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const status = this.resolveStatus(err)

        res.status(status).json({ message: err.message })
    }

    resolveStatus = (error: Error): number => {
        let errorCode = this.errorMapping.get(error.constructor.name)

        if (errorCode === undefined) {
            errorCode = AppErrorHandlerMiddleware.DEFAULT_ERROR_CODE
        }

        return errorCode
    }
}
