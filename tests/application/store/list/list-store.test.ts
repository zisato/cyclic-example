import ListStore from '../../../../src/application/store/list/list-store'
import { ListStoreQuery } from '../../../../src/application/store/list/list-store-query'

describe('ListStore unit test suite', () => {
    const stubs = {
        storeRepository: {
            get: jest.fn(),
            exists: jest.fn(),
            save: jest.fn(),
            findByUserId: jest.fn(),
            find: jest.fn()
        }
    }
    const listStore = new ListStore(stubs.storeRepository)

    test('Should call storeRepository.find once with arguments', async () => {
        const query = new ListStoreQuery()

        await listStore.execute(query)

        const expectedTimes = 1
        expect(stubs.storeRepository.find).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.storeRepository.find).toHaveBeenCalledWith()
    })
})
