import FindProductById from '../../../../src/application/product/find-by-id/find-product-by-id'
import { FindProductByIdQuery } from '../../../../src/application/product/find-by-id/find-product-by-id-query'
import { ProductRepository } from '../../../../src/domain/product/repository/product-repository'
import { UuidV1 } from '../../../../src/infrastructure/identity/uuid-v1'
import { InterfaceMock } from '../../../helpers/interface-mock'

describe('FindProductById unit test suite', () => {
    const stubs = {
        productRepository: {
            get: jest.fn(),
        } as InterfaceMock<ProductRepository>
    }
    const findProductById = new FindProductById(stubs.productRepository)

    test('Should call productRepository.get once with arguments', async () => {
        const storeId = UuidV1.create()
        const query = new FindProductByIdQuery(storeId.value)

        await findProductById.execute(query)

        const expectedTimes = 1
        const expectedArguments = storeId
        expect(stubs.productRepository.get).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.productRepository.get).toHaveBeenCalledWith(expectedArguments)
    })
})
