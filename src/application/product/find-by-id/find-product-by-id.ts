import { FindProductByIdQuery } from './find-product-by-id-query'
import { ProductRepository } from '../../../domain/product/repository/product-repository'
import { Product } from '../../../domain/product/product'

export default class FindProductById {
    constructor(private readonly productRepository: ProductRepository) { }

    async execute(query: FindProductByIdQuery): Promise<Product> {
        return this.productRepository.get(query.id)
    }
}
