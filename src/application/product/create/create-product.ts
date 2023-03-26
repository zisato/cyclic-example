import { Product } from "../../../domain/product/product";
import { ProductRepository } from "../../../domain/product/repository/product-repository";
import { InvalidArgumentError } from "../../../domain/error/invalid-argument-error";
import { CreateProductCommand } from "./create-product-command";
import { CategoryRepository } from "../../../domain/category/repository/category-repository";
import { ModelNotFoundError } from "../../../domain/error/model-not-found-error";
import { StoreRepository } from "../../../domain/store/repository/store-repository";

export default class CreateProduct {
    constructor (
        private readonly productRepository: ProductRepository,
        private readonly categoryRepository: CategoryRepository,
        private readonly storeRepository: StoreRepository
    ) {}

    async execute (command: CreateProductCommand): Promise<void> {
        await this.ensureCategoryIdExists(command.categoryId)
        await this.ensureStoreIdExists(command.storeId)
        await this.ensureProductIdNotExists(command.id)

        const product = new Product(command.id, command.name, command.categoryId, command.storeId)

        this.productRepository.save(product)
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
