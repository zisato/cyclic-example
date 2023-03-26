import UpdateStore from '../../../../src/application/store/update/update-store'
import { UpdateStoreCommand } from '../../../../src/application/store/update/update-store-command'
import { StoreRepository } from '../../../../src/domain/store/repository/store-repository'
import { Store } from '../../../../src/domain/store/store'

describe('UpdateStore unit test suite', () => {
    const stubs = {
        storeRepository: {
            get: jest.fn(),
            exists: jest.fn(),
            save: jest.fn()
        } as StoreRepository
    }
    const updateStore = new UpdateStore(stubs.storeRepository)

    beforeEach(() => {
        jest.resetAllMocks()
    })

    test('Should call storeRepository.get once with arguments', async () => {
        const id = 'store-id'
        const name = 'store-name'
        const store = new Store(id, name)
        const newName = 'new-store-name'
        const command = new UpdateStoreCommand(id, newName)
        stubs.storeRepository.get = jest.fn().mockResolvedValue(store)

        await updateStore.execute(command)

        const expectedTimes = 1
        const expectedArguments = 'store-id'
        expect(stubs.storeRepository.get).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.storeRepository.get).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should call storeRepository.save once with arguments', async () => {
        const id = 'store-id'
        const name = 'store-name'
        const store = new Store(id, name)
        const newName = 'new-store-name'
        const command = new UpdateStoreCommand(id, newName)
        stubs.storeRepository.get = jest.fn().mockResolvedValue(store)

        await updateStore.execute(command)

        const expectedTimes = 1
        const expectedArguments = expect.objectContaining({
            id: 'store-id',
            name: 'new-store-name'
        })
        expect(stubs.storeRepository.save).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.storeRepository.save).toHaveBeenCalledWith(expectedArguments)
    })
})
