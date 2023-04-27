import { Category } from '../../../domain/category/category'
import { CategoryRepository } from '../../../domain/category/repository/category-repository'
import { ListCategoriesQuery } from './list-categories-query'

export default class ListCategories {
    constructor(private readonly categoryRepository: CategoryRepository) { }

    async execute(_query: ListCategoriesQuery): Promise<Category[]> {
        return this.categoryRepository.find()
    }
}
