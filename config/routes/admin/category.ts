import { Container } from '../../../src/simple-kernel/container/container'
import { NextFunction, Request, Response, Router } from 'express'
import { RouterConfiguration } from '../../../src/simple-kernel/configuration/router-configuration'
import CreateCategoryController from '../../../src/infrastructure/category/controller/admin/create-category-controller'
import ListCategoriesController from '../../../src/infrastructure/category/controller/admin/list-categories-controller'
import SellerAuthenticatedMiddleware from '../../../src/infrastructure/express/middleware/seller-authenticated-middleware'
// import { AuthRequest } from '../../../src/infrastructure/express/auth-request'

/*
const checkAuthenticated = (_req: Request, _res: Response, next: NextFunction) => {
    //if (req.isAuthenticated()) {
    //    return next()
    //}

    //res.redirect('/login')
    return next()
}
*/

export class CategoryRouteLoader implements RouterConfiguration {
    getRoutersConfiguration(container: Container): Router[] {
        const router = Router()

        const sellerAuthenticatedMiddleware = container.getTyped(SellerAuthenticatedMiddleware)
        const createCategoryController = container.getTyped(CreateCategoryController)
        const listCategoriesController = container.getTyped(ListCategoriesController)

        router.get('/admin/categories', sellerAuthenticatedMiddleware.handle, async (req: Request, res: Response, next: NextFunction) => {
            try {
                await listCategoriesController.handle(req, res)
            } catch (error) {
                next(error)
            }
        })

        router.get('/admin/categories/create', sellerAuthenticatedMiddleware.handle, async (req: Request, res: Response, next: NextFunction) => {
            try {
                await createCategoryController.handle(req, res)
            } catch (error) {
                next(error)
            }
        })

        router.post('/admin/categories/create', sellerAuthenticatedMiddleware.handle, async (req: Request, res: Response, next: NextFunction) => {
            try {
                await createCategoryController.handle(req, res)
            } catch (error) {
                next(error)
            }
        })

        return [router]
    }
}