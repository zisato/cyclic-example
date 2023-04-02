import FindStoreByUser from '../../../../src/application/store/find-by-user/find-store-by-user'
import { FindStoreByUserQuery } from '../../../../src/application/store/find-by-user/find-store-by-user-query'

describe('FindStoreByUser unit test suite', () => {
    const stubs = {
        storeRepository: {
            get: jest.fn(),
            exists: jest.fn(),
            save: jest.fn(),
            findByUserId: jest.fn(),
            find: jest.fn()
        }
    }
    const findStoreByUser = new FindStoreByUser(stubs.storeRepository)

    test('Should call storeRepository.findByUserId once with arguments', async () => {
        const userId = 'user-id'
        const query = new FindStoreByUserQuery(userId)

        await findStoreByUser.execute(query)

        const expectedTimes = 1
        const expectedArguments = 'user-id'
        expect(stubs.storeRepository.findByUserId).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.storeRepository.findByUserId).toHaveBeenCalledWith(expectedArguments)
    })
})
