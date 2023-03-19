import { Product } from '../../../domain/product/product'
import { ProductRepository } from '../../../domain/product/repository/product-repository'

export default class InMemoryProductRepository implements ProductRepository {
    private readonly data: Product[] = []

    async exists(id: string): Promise<boolean> {
        return this.data.some((product: Product): boolean => {
            return product.id === id
        })
    }

    async save(product: Product): Promise<void> {
        const existingProductIndex = this.data.findIndex((data: Product) => {
            return data.id === product.id
        })

        if (existingProductIndex >= 0) {
            this.data[existingProductIndex] = product
        } else {
            this.data.push(product)
        }
    }
}
