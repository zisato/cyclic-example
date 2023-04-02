import { Product } from '../product'

export interface ProductRepository {
    exists: (id: string) => Promise<boolean>
    save: (product: Product) => Promise<void>
    findByStoreId: (storeId: string) => Promise<Product[]>
}
