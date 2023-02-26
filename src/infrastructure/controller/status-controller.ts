import { Request, Response } from 'express'

export default class StatusController {
    handle = async (_req: Request, res: Response): Promise<void> => {
        res.json({'status': 'ok'})
    }
}