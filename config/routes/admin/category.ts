import { Container } from '../../../src/kernel/container/container'
import { NextFunction, Response, Router } from 'express'
import { RouteLoader } from '../../../src/kernel/bundles/express-server-bundle'
import CreateCategoryController from '../../../src/infrastructure/category/controller/create-category-controller'
import { AuthRequest } from '../../../src/infrastructure/express/auth-request'

export class CategoryRouteLoader implements RouteLoader {
    loadRoutes(container: Container): Router[] {
        const router = Router()

        const createCategoryController = container.getTyped(CreateCategoryController)

        router.post('/admin/categories', async (req: AuthRequest, res: Response, next: NextFunction) => {
            try {
                await createCategoryController.handle(req, res)
            } catch (error) {
                next(error)
            }
        })

        return [router]
    }
}