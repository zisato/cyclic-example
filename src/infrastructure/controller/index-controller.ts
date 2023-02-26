import { Request, Response } from 'express'
import path from 'path';

export default class IndexController {
    handle = async (_req: Request, res: Response): Promise<void> => {
        res.sendFile(path.join(__dirname, '..', '..', '..', 'public', 'index.html'))
    }
}