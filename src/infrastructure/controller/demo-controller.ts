import { Request, Response } from 'express'
import CreateDemo from '../../application/demo/create/create-demo'
import { CreateDemoCommand } from '../../application/demo/create/create-demo-command'

export default class DemoController {
    constructor(private readonly createDemo: CreateDemo) { }

    handle = async (_req: Request, res: Response): Promise<void> => {
        const command = new CreateDemoCommand()
        await this.createDemo.execute(command)

        res.redirect('/')
    }
}
