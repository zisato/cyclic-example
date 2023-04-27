import UpdateProduct from '../../../../src/application/product/update/update-product'
import { UpdateProductCommand } from '../../../../src/application/product/update/update-product-command'
import { Product } from '../../../../src/domain/product/product'
import { ProductRepository } from '../../../../src/domain/product/repository/product-repository'
import { UuidV1 } from '../../../../src/infrastructure/identity/uuid-v1'
import { InterfaceMock } from '../../../helpers/interface-mock'

describe('UpdateProduct unit test suite', () => {
    const stubs = {
        productRepository: {
            get: jest.fn(),
            save: jest.fn()
        } as InterfaceMock<ProductRepository>
    }
    const updateProduct = new UpdateProduct(stubs.productRepository)

    test('Should call productRepository.get once with arguments', async () => {
        const id = UuidV1.create().value
        const name = 'product-name'
        const categoryId = UuidV1.create().value
        const storeId = UuidV1.create().value
        const product = new Product({ id, name, categoryId, storeId })
        const newName = 'new-product-name'
        const command = new UpdateProductCommand(id, newName)
        stubs.productRepository.get.mockResolvedValue(product)

        await updateProduct.execute(command)

        const expectedTimes = 1
        const expectedArguments = id
        expect(stubs.productRepository.get).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.productRepository.get).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should call productRepository.save once with arguments', async () => {
        const id = UuidV1.create().value
        const name = 'product-name'
        const categoryId = UuidV1.create().value
        const storeId = UuidV1.create().value
        const product = new Product({ id, name, categoryId, storeId })
        const newName = 'new-product-name'
        const command = new UpdateProductCommand(id, newName)
        stubs.productRepository.get.mockResolvedValue(product)

        await updateProduct.execute(command)

        const expectedTimes = 1
        const expectedArguments = expect.objectContaining({
            id: id,
            name: 'new-product-name',
            categoryId: categoryId,
            storeId: storeId
        })
        expect(stubs.productRepository.save).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.productRepository.save).toHaveBeenCalledWith(expectedArguments)
    })
})
