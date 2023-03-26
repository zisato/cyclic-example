import { Request, Response, NextFunction } from "express";
import { RequestHandlerMiddleware } from "../../../kernel/bundles/express-server-bundle";
import { AuthRequest } from "../auth-request";

export default class UserAuthenticatedMiddleware implements RequestHandlerMiddleware {
    handle = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        (req as AuthRequest).user = { id: 'b28c1f6e-cbe1-11ed-afa1-0242ac120002' }

        next()
    }
}