import CreateProduct from '../../../../src/application/product/create/create-product'
import { CreateProductCommand } from '../../../../src/application/product/create/create-product-command'
import { ProductRepository } from '../../../../src/domain/product/repository/product-repository'
import { InvalidArgumentError } from '../../../../src/domain/error/invalid-argument-error'
import { CategoryRepository } from '../../../../src/domain/category/repository/category-repository'
import { ModelNotFoundError } from '../../../../src/domain/error/model-not-found-error'
import { StoreRepository } from '../../../../src/domain/store/repository/store-repository'
import { InterfaceMock } from '../../../helpers/interface-mock'
import { UuidV1 } from '../../../../src/infrastructure/identity/uuid-v1'

describe('CreateProduct unit test suite', () => {
    const stubs = {
        productRepository: {
            exists: jest.fn(),
            save: jest.fn()
        } as InterfaceMock<ProductRepository>,
        categoryRepository: {
            exists: jest.fn()
        } as InterfaceMock<CategoryRepository>,
        storeRepository: {
            exists: jest.fn()
        } as InterfaceMock<StoreRepository>
    }
    const createProduct = new CreateProduct(stubs.productRepository, stubs.categoryRepository, stubs.storeRepository)

    test('Should call categoryRepository.exists once with arguments', async () => {
        const id = UuidV1.create().value
        const name = 'product-name'
        const categoryId = UuidV1.create()
        const storeId = UuidV1.create().value
        const command = new CreateProductCommand(id, name, categoryId.value, storeId)
        stubs.categoryRepository.exists.mockResolvedValue(true)
        stubs.storeRepository.exists.mockResolvedValue(true)
        stubs.productRepository.exists.mockResolvedValue(false)

        await createProduct.execute(command)

        const expectedTimes = 1
        const expectedArguments = categoryId
        expect(stubs.categoryRepository.exists).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.categoryRepository.exists).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should throw error when category id not exists', async () => {
        const id = UuidV1.create().value
        const name = 'product-name'
        const categoryId = UuidV1.create().value
        const storeId = UuidV1.create().value
        const command = new CreateProductCommand(id, name, categoryId, storeId)
        stubs.categoryRepository.exists.mockResolvedValue(false)

        const promise = createProduct.execute(command)

        const expectedError = new ModelNotFoundError(`Category with id ${categoryId} not found`)
        void expect(promise).rejects.toThrowError(expectedError)
    })

    test('Should call storeRepository.exists once with arguments', async () => {
        const id = UuidV1.create().value
        const name = 'product-name'
        const categoryId = UuidV1.create().value
        const storeId = UuidV1.create()
        const command = new CreateProductCommand(id, name, categoryId, storeId.value)
        stubs.categoryRepository.exists.mockResolvedValue(true)
        stubs.storeRepository.exists.mockResolvedValue(true)
        stubs.productRepository.exists.mockResolvedValue(false)

        await createProduct.execute(command)

        const expectedTimes = 1
        const expectedArguments = storeId
        expect(stubs.storeRepository.exists).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.storeRepository.exists).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should throw error when store id not exists', async () => {
        const id = UuidV1.create().value
        const name = 'product-name'
        const categoryId = UuidV1.create().value
        const storeId = UuidV1.create().value
        const command = new CreateProductCommand(id, name, categoryId, storeId)
        stubs.categoryRepository.exists.mockResolvedValue(true)
        stubs.storeRepository.exists.mockResolvedValue(false)

        const promise = createProduct.execute(command)

        const expectedError = new ModelNotFoundError(`Store with id ${storeId} not found`)
        void expect(promise).rejects.toThrowError(expectedError)
    })

    test('Should call productRepository.exists once with arguments', async () => {
        const id = UuidV1.create()
        const name = 'product-name'
        const categoryId = UuidV1.create().value
        const storeId = UuidV1.create().value
        const command = new CreateProductCommand(id.value, name, categoryId, storeId)
        stubs.categoryRepository.exists.mockResolvedValue(true)
        stubs.storeRepository.exists.mockResolvedValue(true)
        stubs.productRepository.exists.mockResolvedValue(false)

        await createProduct.execute(command)

        const expectedTimes = 1
        const expectedArguments = id
        expect(stubs.productRepository.exists).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.productRepository.exists).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should throw error when product id exists', async () => {
        const id = UuidV1.create().value
        const name = 'product-name'
        const categoryId = UuidV1.create().value
        const storeId = UuidV1.create().value
        const command = new CreateProductCommand(id, name, categoryId, storeId)
        stubs.categoryRepository.exists.mockResolvedValue(true)
        stubs.storeRepository.exists.mockResolvedValue(true)
        stubs.productRepository.exists.mockResolvedValue(true)

        const promise = createProduct.execute(command)

        const expectedError = new InvalidArgumentError(`Existing Product with id ${id}`)
        void expect(promise).rejects.toThrowError(expectedError)
    })

    test('Should call productRepository.save once with arguments', async () => {
        const id = UuidV1.create()
        const name = 'product-name'
        const categoryId = UuidV1.create().value
        const storeId = UuidV1.create().value
        const command = new CreateProductCommand(id.value, name, categoryId, storeId)
        stubs.categoryRepository.exists.mockResolvedValue(true)
        stubs.storeRepository.exists.mockResolvedValue(true)
        stubs.productRepository.exists.mockResolvedValue(false)

        await createProduct.execute(command)

        const expectedTimes = 1
        const expectedArguments = expect.objectContaining({
            id,
            name: 'product-name'
        })
        expect(stubs.productRepository.save).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.productRepository.save).toHaveBeenCalledWith(expectedArguments)
    })
})
