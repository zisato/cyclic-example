import { Category } from '../../../domain/category/category'
import { CategoryRepository } from '../../../domain/category/repository/category-repository'

export default class InMemoryCategoryRepository implements CategoryRepository {
    private readonly data: Category[] = []

    async exists(id: string): Promise<boolean> {
        return this.data.some((category: Category): boolean => {
            return category.id === id
        })
    }

    async save(category: Category): Promise<void> {
        const existingCategoryIndex = this.data.findIndex((data: Category) => {
            return data.id === category.id
        })

        if (existingCategoryIndex >= 0) {
            this.data[existingCategoryIndex] = category
        } else {
            this.data.push(category)
        }
    }
}
