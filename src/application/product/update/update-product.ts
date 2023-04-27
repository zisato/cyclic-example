import { ProductRepository } from '../../../domain/product/repository/product-repository'
import { UpdateProductCommand } from './update-product-command'

export default class UpdateProduct {
    constructor(private readonly productRepository: ProductRepository) { }

    async execute(command: UpdateProductCommand): Promise<void> {
        let product = await this.productRepository.get(command.id)

        product = product.changeName(command.name)

        this.productRepository.save(product)
    }
}
