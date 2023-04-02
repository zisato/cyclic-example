import { CategoryRepository } from '../../../domain/category/repository/category-repository'
import { CreateCategoryService } from '../../../domain/category/service/create-category-service'
import { CreateCategoryCommand } from './create-category-command'

export default class CreateCategory {
    constructor (private readonly categoryRepository: CategoryRepository) {}

    async execute (command: CreateCategoryCommand): Promise<void> {
        const service = new CreateCategoryService(this.categoryRepository)

        await service.create(command.id, command.name)
    }
}
