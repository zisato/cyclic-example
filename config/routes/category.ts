import { Container } from '../../src/kernel/container/container'
import { NextFunction, Request, Response, Router } from 'express'
import { RouteLoader } from '../../src/kernel/bundles/express-server-bundle'
import CreateCategoryController from '../../src/infrastructure/category/controller/create-category-controller'

export class CategoryRouteLoader implements RouteLoader {
    loadRoutes (container: Container): Router[] {
        const router = Router()

        const createCategoryController = container.getTyped(CreateCategoryController)
        
        router.post('/categories', async (req: Request, res: Response, next: NextFunction) => {
            try {
                await createCategoryController.handle(req, res)
            } catch (error) {
                next(error)
            }
        })
        
        return [router]
    }
}