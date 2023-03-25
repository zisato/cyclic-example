import { Category } from "../../../domain/category/category";
import { CategoryRepository } from "../../../domain/category/repository/category-repository";
import { InvalidArgumentError } from "../../../domain/error/invalid-argument-error";
import { CreateCategoryCommand } from "./create-category-command";

export default class CreateCategory {
    constructor (private readonly categoryRepository: CategoryRepository) {}

    async execute (command: CreateCategoryCommand): Promise<void> {
        await this.ensureCategoryIdNotExists(command.id)

        const category = new Category(command.id, command.name)

        this.categoryRepository.save(category)
    }

    async ensureCategoryIdNotExists(id: string): Promise<void> {
        if (await this.categoryRepository.exists(id)) {
            throw new InvalidArgumentError(`Existing Category with id ${id}`)
        }
    }
}
