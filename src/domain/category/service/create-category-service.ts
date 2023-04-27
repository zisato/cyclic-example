import { InvalidArgumentError } from '../../error/invalid-argument-error'
import { CategoryRepository } from '../repository/category-repository'
import { Category } from '../category'
import { Identity } from '../../identity/identity'

export class CreateCategoryService {
    constructor(private readonly categoryRepository: CategoryRepository) { }

    async create(id: Identity, name: string): Promise<void> {
        await this.ensureCategoryIdNotExists(id)

        const category = new Category({ id, name })

        await this.categoryRepository.save(category)
    }

    async ensureCategoryIdNotExists(id: Identity): Promise<void> {
        if (await this.categoryRepository.exists(id)) {
            throw new InvalidArgumentError(`Existing Category with id ${id.value}`)
        }
    }
}
