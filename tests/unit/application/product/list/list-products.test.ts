import ListProducts from '../../../../../src/application/product/list/list-products'
import { ListProductsQuery } from '../../../../../src/application/product/list/list-products-query'
import { ProductRepository } from '../../../../../src/domain/product/repository/product-repository'
import { UuidV1 } from '../../../../../src/infrastructure/identity/uuid-v1'
import { InterfaceMock } from '../../../../helpers/interface-mock'

describe('ListProducts unit test suite', () => {
    const stubs = {
        productRepository: {
            findByStoreId: jest.fn()
        } as InterfaceMock<ProductRepository>
    }
    const listProducts = new ListProducts(stubs.productRepository)

    test('Should call productRepository.findByStoreId once with arguments', async () => {
        const sellerId = UuidV1.create()
        const query = new ListProductsQuery(sellerId.value)

        await listProducts.execute(query)

        const expectedTimes = 1
        const expectedArguments = sellerId
        expect(stubs.productRepository.findByStoreId).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.productRepository.findByStoreId).toHaveBeenCalledWith(expectedArguments)
    })
})
