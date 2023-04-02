import { Request, Response } from 'express'

export default class IndexController {
    handle = async (_req: Request, res: Response): Promise<void> => {
        res.render('index')
    }
}
