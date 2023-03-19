import { Product } from "../../../domain/product/product";
import { ProductRepository } from "../../../domain/product/repository/product-repository";
import { InvalidArgumentError } from "../../../domain/error/invalid-argument-error";
import { CreateProductCommand } from "./create-product-command";

export default class CreateProduct {
    constructor (private readonly productRepository: ProductRepository) {}

    async execute (command: CreateProductCommand): Promise<void> {
        await this.ensureProductIdNotExists(command.id)

        const product = new Product(command.id, command.name)

        this.productRepository.save(product)
    }

    async ensureProductIdNotExists(id: string): Promise<void> {
        if (await this.productRepository.exists(id)) {
            throw new InvalidArgumentError(`Existing Product with id ${id}`)
        }
    }
}
