import FindStoreBySellerId from '../../../../../src/application/store/find-by-seller-id/find-store-by-seller-id'
import { FindStoreBySellerIdQuery } from '../../../../../src/application/store/find-by-seller-id/find-store-by-seller-id-query'
import { StoreRepository } from '../../../../../src/domain/store/repository/store-repository'
import { UuidV1 } from '../../../../../src/infrastructure/identity/uuid-v1'
import { InterfaceMock } from '../../../../helpers/interface-mock'

describe('FindStoreBySellerId unit test suite', () => {
    const stubs = {
        storeRepository: {
            findBySellerId: jest.fn(),
        } as InterfaceMock<StoreRepository>
    }
    const findStoreBySellerId = new FindStoreBySellerId(stubs.storeRepository)

    test('Should call storeRepository.findByUserId once with arguments', async () => {
        const sellerId = UuidV1.create()
        const query = new FindStoreBySellerIdQuery(sellerId.value)

        await findStoreBySellerId.execute(query)

        const expectedTimes = 1
        const expectedArguments = sellerId
        expect(stubs.storeRepository.findBySellerId).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.storeRepository.findBySellerId).toHaveBeenCalledWith(expectedArguments)
    })
})
