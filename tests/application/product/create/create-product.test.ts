import CreateProduct from '../../../../src/application/product/create/create-product'
import { CreateProductCommand } from '../../../../src/application/product/create/create-product-command'
import { ProductRepository } from '../../../../src/domain/product/repository/product-repository'
import { InvalidArgumentError } from '../../../../src/domain/error/invalid-argument-error'
import { CategoryRepository } from '../../../../src/domain/category/repository/category-repository'
import { ModelNotFoundError } from '../../../../src/domain/error/model-not-found-error'
import { StoreRepository } from '../../../../src/domain/store/repository/store-repository'

describe('CreateProduct unit test suite', () => {
    const stubs = {
        productRepository: {
            exists: jest.fn(),
            save: jest.fn()
        } as ProductRepository,
        categoryRepository: {
            exists: jest.fn(),
            save: jest.fn()
        } as CategoryRepository,
        storeRepository: {
            get: jest.fn(),
            exists: jest.fn(),
            save: jest.fn()
        } as StoreRepository
    }
    const createProduct = new CreateProduct(stubs.productRepository, stubs.categoryRepository, stubs.storeRepository)

    beforeEach(() => {
        jest.resetAllMocks()
    })

    test('Should call categoryRepository.exists once with arguments', async () => {
        const id = 'product-id'
        const name = 'product-name'
        const categoryId = 'category-id'
        const storeId = 'store-id'
        const command = new CreateProductCommand(id, name, categoryId, storeId)
        stubs.categoryRepository.exists = jest.fn().mockResolvedValue(true)
        stubs.storeRepository.exists = jest.fn().mockResolvedValue(true)
        stubs.productRepository.exists = jest.fn().mockResolvedValue(false)

        await createProduct.execute(command)

        const expectedTimes = 1
        const expectedArguments = 'category-id'
        expect(stubs.categoryRepository.exists).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.categoryRepository.exists).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should throw error when category id not exists', async () => {
        const id = 'product-id'
        const name = 'product-name'
        const categoryId = 'category-id'
        const storeId = 'store-id'
        const command = new CreateProductCommand(id, name, categoryId, storeId)
        stubs.categoryRepository.exists = jest.fn().mockResolvedValue(false)

        const promise = createProduct.execute(command)

        const expectedError = new ModelNotFoundError('Category with id category-id not found')
        expect(promise).rejects.toThrowError(expectedError)
    })

    test('Should call storeRepository.exists once with arguments', async () => {
        const id = 'product-id'
        const name = 'product-name'
        const categoryId = 'category-id'
        const storeId = 'store-id'
        const command = new CreateProductCommand(id, name, categoryId, storeId)
        stubs.categoryRepository.exists = jest.fn().mockResolvedValue(true)
        stubs.storeRepository.exists = jest.fn().mockResolvedValue(true)
        stubs.productRepository.exists = jest.fn().mockResolvedValue(false)

        await createProduct.execute(command)

        const expectedTimes = 1
        const expectedArguments = 'store-id'
        expect(stubs.storeRepository.exists).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.storeRepository.exists).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should throw error when store id not exists', async () => {
        const id = 'product-id'
        const name = 'product-name'
        const categoryId = 'category-id'
        const storeId = 'store-id'
        const command = new CreateProductCommand(id, name, categoryId, storeId)
        stubs.categoryRepository.exists = jest.fn().mockResolvedValue(true)
        stubs.storeRepository.exists = jest.fn().mockResolvedValue(false)

        const promise = createProduct.execute(command)

        const expectedError = new ModelNotFoundError('Store with id store-id not found')
        expect(promise).rejects.toThrowError(expectedError)
    })

    test('Should call productRepository.exists once with arguments', async () => {
        const id = 'product-id'
        const name = 'product-name'
        const categoryId = 'category-id'
        const storeId = 'store-id'
        const command = new CreateProductCommand(id, name, categoryId, storeId)
        stubs.categoryRepository.exists = jest.fn().mockResolvedValue(true)
        stubs.storeRepository.exists = jest.fn().mockResolvedValue(true)
        stubs.productRepository.exists = jest.fn().mockResolvedValue(false)

        await createProduct.execute(command)

        const expectedTimes = 1
        const expectedArguments = 'product-id'
        expect(stubs.productRepository.exists).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.productRepository.exists).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should throw error when product id exists', async () => {
        const id = 'product-id'
        const name = 'product-name'
        const categoryId = 'category-id'
        const storeId = 'store-id'
        const command = new CreateProductCommand(id, name, categoryId, storeId)
        stubs.categoryRepository.exists = jest.fn().mockResolvedValue(true)
        stubs.storeRepository.exists = jest.fn().mockResolvedValue(true)
        stubs.productRepository.exists = jest.fn().mockResolvedValue(true)

        const promise = createProduct.execute(command)

        const expectedError = new InvalidArgumentError('Existing Product with id product-id')
        expect(promise).rejects.toThrowError(expectedError)
    })

    test('Should call productRepository.save once with arguments', async () => {
        const id = 'product-id'
        const name = 'product-name'
        const categoryId = 'category-id'
        const storeId = 'store-id'
        const command = new CreateProductCommand(id, name, categoryId, storeId)
        stubs.categoryRepository.exists = jest.fn().mockResolvedValue(true)
        stubs.storeRepository.exists = jest.fn().mockResolvedValue(true)
        stubs.productRepository.exists = jest.fn().mockResolvedValue(false)

        await createProduct.execute(command)

        const expectedTimes = 1
        const expectedArguments = expect.objectContaining({
            id: 'product-id',
            name: 'product-name'
        })
        expect(stubs.productRepository.save).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.productRepository.save).toHaveBeenCalledWith(expectedArguments)
    })
})
