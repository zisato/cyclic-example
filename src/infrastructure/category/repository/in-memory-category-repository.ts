import { Category } from '../../../domain/category/category'
import { CategoryRepository } from '../../../domain/category/repository/category-repository'
import { Identity } from '../../../domain/identity/identity'

export default class InMemoryCategoryRepository implements CategoryRepository {
    private readonly data: Category[] = []
    
    async find(): Promise<Category[]> {
        return this.data
    }

    async exists(id: Identity): Promise<boolean> {
        return this.data.some((category: Category): boolean => {
            return category.id.equals(id)
        })
    }

    async save(category: Category): Promise<void> {
        const existingCategoryIndex = this.data.findIndex((data: Category) => {
            return category.id.equals(data.id)
        })

        if (existingCategoryIndex >= 0) {
            this.data[existingCategoryIndex] = category
        } else {
            this.data.push(category)
        }
    }
}
