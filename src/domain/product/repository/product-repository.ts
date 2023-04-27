import { Identity } from '../../identity/identity'
import { Product } from '../product'

export interface ProductRepository {
    get: (id: Identity) => Promise<Product>
    exists: (id: Identity) => Promise<boolean>
    save: (product: Product) => Promise<void>
    findByStoreId: (storeId: Identity) => Promise<Product[]>
}
