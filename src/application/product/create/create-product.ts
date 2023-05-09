import { CreateProductCommand } from './create-product-command'
import { CreateProductService } from '../../../domain/product/service/create-product-service'
import { ProductRepository } from '../../../domain/product/repository/product-repository'
import { CategoryRepository } from '../../../domain/category/repository/category-repository'
import { StoreRepository } from '../../../domain/store/repository/store-repository'

export default class CreateProduct {
    constructor (
        private readonly productRepository: ProductRepository,
        private readonly categoryRepository: CategoryRepository,
        private readonly storeRepository: StoreRepository
    ) {}

    async execute (command: CreateProductCommand): Promise<void> {
        const service = new CreateProductService(
            this.productRepository,
            this.categoryRepository,
            this.storeRepository
        )

        await service.create(command.id, command.name, command.categoryId, command.storeId, command.imageFilename)
    }
}
