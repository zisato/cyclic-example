import { Identity } from '../../identity/identity'
import { Category } from '../category'

export interface CategoryRepository {
    find: () => Promise<Category[]>
    exists: (id: Identity) => Promise<boolean>
    save: (category: Category) => Promise<void>
}
