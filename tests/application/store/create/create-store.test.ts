import CreateStore from '../../../../src/application/store/create/create-store'
import { CreateStoreCommand } from '../../../../src/application/store/create/create-store-command'
import { StoreRepository } from '../../../../src/domain/store/repository/store-repository'
import { InvalidArgumentError } from '../../../../src/domain/error/invalid-argument-error'
import { SellerRepository } from '../../../../src/domain/seller/repository/seller-repository'
import { ModelNotFoundError } from '../../../../src/domain/error/model-not-found-error'
import { InterfaceMock } from '../../../helpers/interface-mock'

describe('CreateStore unit test suite', () => {
    const stubs = {
        storeRepository: {
            exists: jest.fn(),
            save: jest.fn(),
        } as InterfaceMock<StoreRepository>,
        sellerRepository: {
            exists: jest.fn(),
        } as InterfaceMock<SellerRepository>
    }
    const createStore = new CreateStore(stubs.storeRepository, stubs.sellerRepository)

    test('Should call storeRepository.exists once with arguments', async () => {
        const id = 'store-id'
        const name = 'store-name'
        const userId = 'user-id'
        const command = new CreateStoreCommand(id, name, userId)
        stubs.storeRepository.exists.mockResolvedValueOnce(false)
        stubs.sellerRepository.exists.mockResolvedValueOnce(true)

        await createStore.execute(command)

        const expectedTimes = 1
        const expectedArguments = 'store-id'
        expect(stubs.storeRepository.exists).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.storeRepository.exists).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should throw error when store id exists', async () => {
        const id = 'store-id'
        const name = 'store-name'
        const userId = 'user-id'
        const command = new CreateStoreCommand(id, name, userId)
        stubs.storeRepository.exists.mockResolvedValueOnce(true)

        const promise = createStore.execute(command)

        const expectedError = new InvalidArgumentError('Existing Store with id store-id')
        void expect(promise).rejects.toThrowError(expectedError)
    })

    test('Should call userRepository.exists once with arguments', async () => {
        const id = 'store-id'
        const name = 'store-name'
        const userId = 'user-id'
        const command = new CreateStoreCommand(id, name, userId)
        stubs.storeRepository.exists.mockResolvedValueOnce(false)
        stubs.sellerRepository.exists.mockResolvedValueOnce(true)

        await createStore.execute(command)

        const expectedTimes = 1
        const expectedArguments = 'user-id'
        expect(stubs.sellerRepository.exists).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.sellerRepository.exists).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should throw error when user id not exists', async () => {
        const id = 'store-id'
        const name = 'store-name'
        const userId = 'user-id'
        const command = new CreateStoreCommand(id, name, userId)
        stubs.storeRepository.exists.mockResolvedValueOnce(false)
        stubs.sellerRepository.exists.mockResolvedValueOnce(false)

        const promise = createStore.execute(command)

        const expectedError = new ModelNotFoundError('Seller with id user-id not found')
        void expect(promise).rejects.toThrowError(expectedError)
    })

    test('Should call storeRepository.save once with arguments', async () => {
        const id = 'store-id'
        const name = 'store-name'
        const userId = 'user-id'
        const command = new CreateStoreCommand(id, name, userId)
        stubs.storeRepository.exists.mockResolvedValueOnce(false)
        stubs.sellerRepository.exists.mockResolvedValueOnce(true)

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
