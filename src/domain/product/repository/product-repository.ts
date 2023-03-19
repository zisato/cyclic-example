import { Product } from "../product"

export interface ProductRepository {
    exists: (id: string) => Promise<boolean>
    save: (product: Product) => Promise<void>
}