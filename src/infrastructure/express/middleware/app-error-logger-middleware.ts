import { Request, Response, NextFunction } from 'express'

export default class AppErrorLoggerMiddleware {
    handle = async (err: Error, _req: Request, _res: Response, next: NextFunction): Promise<void> => {
        console.debug(err.stack)
        next(err)
    }
}
