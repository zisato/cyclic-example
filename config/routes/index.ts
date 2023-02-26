import { Container } from '../../src/kernel/container/container'
import { Router, Request, Response } from 'express'
import { RouteLoader } from '../../src/kernel/bundles/express-server-bundle'

export class IndexRouteLoader implements RouteLoader {
    loadRoutes (_container: Container): Router[] {
        const router = Router()

        router.get('/', (_req: Request, res: Response) => {
            res.json({'hello': 'world'})
        })

        return [router]
    }
}