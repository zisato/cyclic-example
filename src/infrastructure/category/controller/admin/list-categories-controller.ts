import { Request, Response } from 'express'
import ListCategories from '../../../../application/category/list/list-categories'
import { ListCategoriesQuery } from '../../../../application/category/list/list-categories-query'
import { Category } from '../../../../domain/category/category'

export default class ListCategoriesController {
    constructor(private readonly listCategories: ListCategories) { }

    handle = async (_req: Request, res: Response): Promise<void> => {
        const query = new ListCategoriesQuery()

        const categories = await this.listCategories.execute(query)
        const categoriesJsonApi = categories.map((category: Category) => {
            return {
                id: category.id,
                attributes: {
                    name: category.name
                }
            }
        })

        res.status(200).render('admin/category/list', {
            categories: categoriesJsonApi
        })
    }
}