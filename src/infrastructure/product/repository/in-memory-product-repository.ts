import { ModelNotFoundError } from '../../../domain/error/model-not-found-error'
import { Product } from '../../../domain/product/product'
import { ProductRepository } from '../../../domain/product/repository/product-repository'

export default class InMemoryProductRepository implements ProductRepository {
    private readonly data: Product[] = []

    async get(id: string): Promise<Product> {
        const existingProductIndex = this.data.findIndex((product: Product) => {
            return product.id === id
        })

        if (existingProductIndex === -1) {
            throw new ModelNotFoundError(`Product with id ${id} not found`)
        }

        return this.data[existingProductIndex]
    }

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

    async findByStoreId(storeId: string): Promise<Product[]> {
        return this.data.filter((product: Product) => {
            return product.storeId === storeId
        })
    }
}
