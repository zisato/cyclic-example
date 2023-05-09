import { Request, Response } from 'express'
import ListCategories from '../../../../application/category/list/list-categories'
import { ListCategoriesQuery } from '../../../../application/category/list/list-categories-query'
import JsonApiCategoryTransformer from '../../transformer/json-api-category-transformer'

export default class ListCategoriesController {
    constructor(
        private readonly listCategories: ListCategories,
        private readonly jsonApiCategoryTransformer: JsonApiCategoryTransformer
    ) { }

    handle = async (_req: Request, res: Response): Promise<void> => {
        const query = new ListCategoriesQuery()

        const categories = await this.listCategories.execute(query)
        const categoriesJsonApi = this.jsonApiCategoryTransformer.transformArray(categories)

        res.status(200).render('admin/category/list', {
            categories: categoriesJsonApi
        })
    }
}
