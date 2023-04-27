import { Category } from '../category'

export interface CategoryRepository {
    find: () => Promise<Category[]>
    exists: (id: string) => Promise<boolean>
    save: (category: Category) => Promise<void>
}
