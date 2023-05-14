import { CategoryRepository } from '../../../domain/category/repository/category-repository'
import { DeleteCategoryCommand } from './delete-category-command'

export default class DeleteCategory {
    constructor (private readonly categoryRepository: CategoryRepository) {}

    async execute (command: DeleteCategoryCommand): Promise<void> {
        await this.categoryRepository.delete(command.categoryId)
    }
}
