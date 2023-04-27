import { Product } from '../product'

export interface ProductRepository {
    get: (id: string) => Promise<Product>
    exists: (id: string) => Promise<boolean>
    save: (product: Product) => Promise<void>
    findByStoreId: (storeId: string) => Promise<Product[]>
}
