import CreateCategory from '../../../../src/application/category/create/create-category'
import { CreateCategoryCommand } from '../../../../src/application/category/create/create-category-command'
import { CategoryRepository } from '../../../../src/domain/category/repository/category-repository'
import { InvalidArgumentError } from '../../../../src/domain/error/invalid-argument-error'

describe('CreateCategory unit test suite', () => {
    const stubs = {
        categoryRepository: {
            exists: jest.fn(),
            save: jest.fn()
        } as CategoryRepository
    }
    const createCategory = new CreateCategory(stubs.categoryRepository)

    test('Should call categoryRepository.exists once with arguments', async () => {
        const id = 'category-id'
        const name = 'category-name'
        const command = new CreateCategoryCommand(id, name)
        stubs.categoryRepository.exists = jest.fn().mockResolvedValue(false)

        await createCategory.execute(command)

        const expectedTimes = 1
        const expectedArguments = 'category-id'
        expect(stubs.categoryRepository.exists).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.categoryRepository.exists).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should throw error when category id exists', async () => {
        const id = 'category-id'
        const name = 'category-name'
        const command = new CreateCategoryCommand(id, name)
        stubs.categoryRepository.exists = jest.fn().mockResolvedValue(true)

        const promise = createCategory.execute(command)

        const expectedError = new InvalidArgumentError('Existing Category with id category-id')
        void expect(promise).rejects.toThrowError(expectedError)
    })

    test('Should call categoryRepository.save once with arguments', async () => {
        const id = 'category-id'
        const name = 'category-name'
        const command = new CreateCategoryCommand(id, name)
        stubs.categoryRepository.exists = jest.fn().mockResolvedValue(false)

        await createCategory.execute(command)

        const expectedTimes = 1
        const expectedArguments = expect.objectContaining({
            id: 'category-id',
            name: 'category-name'
        })
        expect(stubs.categoryRepository.save).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.categoryRepository.save).toHaveBeenCalledWith(expectedArguments)
    })
})
