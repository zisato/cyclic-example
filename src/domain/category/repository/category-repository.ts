import { Category } from '../category'

export interface CategoryRepository {
    exists: (id: string) => Promise<boolean>
    save: (category: Category) => Promise<void>
}
