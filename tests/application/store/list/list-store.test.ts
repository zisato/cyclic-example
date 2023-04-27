import ListStore from '../../../../src/application/store/list/list-store'
import { ListStoreQuery } from '../../../../src/application/store/list/list-store-query'
import { StoreRepository } from '../../../../src/domain/store/repository/store-repository'
import { InterfaceMock } from '../../../helpers/interface-mock'

describe('ListStore unit test suite', () => {
    const stubs = {
        storeRepository: {
            find: jest.fn()
        } as InterfaceMock<StoreRepository>
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
