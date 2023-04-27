import FindStoreById from '../../../../src/application/store/find-by-id/find-store-by-id'
import { FindStoreByIdQuery } from '../../../../src/application/store/find-by-id/find-store-by-id-query'
import { StoreRepository } from '../../../../src/domain/store/repository/store-repository'
import { UuidV1 } from '../../../../src/infrastructure/identity/uuid-v1'
import { InterfaceMock } from '../../../helpers/interface-mock'

describe('FindStoreById unit test suite', () => {
    const stubs = {
        storeRepository: {
            get: jest.fn(),
        } as InterfaceMock<StoreRepository>
    }
    const findStoreById = new FindStoreById(stubs.storeRepository)

    test('Should call storeRepository.findByUserId once with arguments', async () => {
        const storeId = UuidV1.create()
        const query = new FindStoreByIdQuery(storeId.value)

        await findStoreById.execute(query)

        const expectedTimes = 1
        const expectedArguments = storeId
        expect(stubs.storeRepository.get).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.storeRepository.get).toHaveBeenCalledWith(expectedArguments)
    })
})
