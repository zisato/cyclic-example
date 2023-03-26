import CreateStore from '../../../../src/application/store/create/create-store'
import { CreateStoreCommand } from '../../../../src/application/store/create/create-store-command'
import { StoreRepository } from '../../../../src/domain/store/repository/store-repository'
import { InvalidArgumentError } from '../../../../src/domain/error/invalid-argument-error'

describe('CreateStore unit test suite', () => {
    const stubs = {
        storeRepository: {
            exists: jest.fn(),
            save: jest.fn()
        } as StoreRepository
    }
    const createStore = new CreateStore(stubs.storeRepository)

    beforeEach(() => {
        jest.resetAllMocks()
    })

    test('Should call storeRepository.exists once with arguments', async () => {
        const id = 'store-id'
        const name = 'store-name'
        const command = new CreateStoreCommand(id, name)
        stubs.storeRepository.exists = jest.fn().mockResolvedValue(false)

        await createStore.execute(command)

        const expectedTimes = 1
        const expectedArguments = 'store-id'
        expect(stubs.storeRepository.exists).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.storeRepository.exists).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should throw error when store id exists', async () => {
        const id = 'store-id'
        const name = 'store-name'
        const command = new CreateStoreCommand(id, name)
        stubs.storeRepository.exists = jest.fn().mockResolvedValue(true)

        const promise = createStore.execute(command)

        const expectedError = new InvalidArgumentError('Existing Store with id store-id')
        expect(promise).rejects.toThrowError(expectedError)
    })

    test('Should call storeRepository.save once with arguments', async () => {
        const id = 'store-id'
        const name = 'store-name'
        const command = new CreateStoreCommand(id, name)
        stubs.storeRepository.exists = jest.fn().mockResolvedValue(false)

        await createStore.execute(command)

        const expectedTimes = 1
        const expectedArguments = expect.objectContaining({
            id: 'store-id',
            name: 'store-name'
        })
        expect(stubs.storeRepository.save).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.storeRepository.save).toHaveBeenCalledWith(expectedArguments)
    })
})
