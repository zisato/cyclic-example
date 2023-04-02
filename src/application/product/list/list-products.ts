import { Product } from '../../../domain/product/product'
import { ProductRepository } from '../../../domain/product/repository/product-repository'
import { ListProductsQuery } from './list-products-query'

export default class ListProducts {
    constructor (private readonly productRepository: ProductRepository) {}

    async execute (query: ListProductsQuery): Promise<Product[]> {
        return this.productRepository.findByStoreId(query.storeId)
    }
}
