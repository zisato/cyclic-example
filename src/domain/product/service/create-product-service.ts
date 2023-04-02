import { CategoryRepository } from '../../category/repository/category-repository'
import { InvalidArgumentError } from '../../error/invalid-argument-error'
import { ModelNotFoundError } from '../../error/model-not-found-error'
import { StoreRepository } from '../../store/repository/store-repository'
import { Product } from '../product'
import { ProductRepository } from '../repository/product-repository'

export class CreateProductService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly categoryRepository: CategoryRepository,
        private readonly storeRepository: StoreRepository
    ) { }

    async create(id: string, name: string, categoryId: string, storeId: string): Promise<void> {
        await this.ensureCategoryIdExists(categoryId)
        await this.ensureStoreIdExists(storeId)
        await this.ensureProductIdNotExists(id)

        const product = new Product({ id, name, categoryId, storeId })

        await this.productRepository.save(product)
    }

    async ensureCategoryIdExists(id: string): Promise<void> {
        if (!await this.categoryRepository.exists(id)) {
            throw new ModelNotFoundError(`Category with id ${id} not found`)
        }
    }

    async ensureStoreIdExists(id: string): Promise<void> {
        if (!await this.storeRepository.exists(id)) {
            throw new ModelNotFoundError(`Store with id ${id} not found`)
        }
    }

    async ensureProductIdNotExists(id: string): Promise<void> {
        if (await this.productRepository.exists(id)) {
            throw new InvalidArgumentError(`Existing Product with id ${id}`)
        }
    }
}
