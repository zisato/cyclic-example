import { CategoryRepository } from '../../category/repository/category-repository'
import { InvalidArgumentError } from '../../error/invalid-argument-error'
import { ModelNotFoundError } from '../../error/model-not-found-error'
import { Identity } from '../../identity/identity'
import { StoreRepository } from '../../store/repository/store-repository'
import { Image } from '../image'
import { Product } from '../product'
import { ProductRepository } from '../repository/product-repository'

export class CreateProductService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly categoryRepository: CategoryRepository,
        private readonly storeRepository: StoreRepository
    ) { }

    async create(id: Identity, name: string, categoryId: Identity, storeId: Identity, image?: Image): Promise<void> {
        await this.ensureCategoryIdExists(categoryId)
        await this.ensureStoreIdExists(storeId)
        await this.ensureProductIdNotExists(id)
        const imageFile = image ?? null

        const product = new Product({ id, name, categoryId, storeId, image: imageFile })

        await this.productRepository.save(product)
    }

    private async ensureCategoryIdExists(id: Identity): Promise<void> {
        if (!await this.categoryRepository.exists(id)) {
            throw new ModelNotFoundError(`Category with id ${id.value} not found`)
        }
    }

    private async ensureStoreIdExists(id: Identity): Promise<void> {
        if (!await this.storeRepository.exists(id)) {
            throw new ModelNotFoundError(`Store with id ${id.value} not found`)
        }
    }

    private async ensureProductIdNotExists(id: Identity): Promise<void> {
        if (await this.productRepository.exists(id)) {
            throw new InvalidArgumentError(`Existing Product with id ${id.value}`)
        }
    }

    /*
    private handleImage(name: string, image?: File): string | null {
        let imageStorageId: string | null = null
        if (image) {
            this.fileStorageService.put(name, image)
            imageStorageId = name
        }

        return imageStorageId
    }
    */
}
