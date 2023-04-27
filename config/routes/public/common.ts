import { Container } from '../../../src/simple-kernel/container/container'
import { NextFunction, Request, Response, Router } from 'express'
import IndexController from '../../../src/infrastructure/controller/index-controller'
import StatusController from '../../../src/infrastructure/controller/status-controller'
import DemoController from '../../../src/infrastructure/controller/demo-controller'
import { RouterConfiguration } from '../../../src/simple-kernel/configuration/router-configuration'

export class CommonRouterConfiguration implements RouterConfiguration {
    getRoutersConfiguration(container: Container): Router[] {
        const router = Router()

        const indexController = container.getTyped(IndexController)
        const statusController = container.getTyped(StatusController)
        const demoController = container.getTyped(DemoController)

        router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                await indexController.handle(req, res)
            } catch (error) {
                next(error)
            }
        })

        router.get('/status', statusController.handle)

        router.post('/demo', async (req: Request, res: Response, next: NextFunction) => {
            try {
                await demoController.handle(req, res)
            } catch (error) {
                next(error)
            }
        })

        return [router]
    }
}
