import { Server } from 'http'
import request from 'supertest'
import { App } from '../../../../../../src/app'
import { Store } from '../../../../../../src/domain/store/store'
import { StoreRepository } from '../../../../../../src/domain/store/repository/store-repository'
import { UuidV1 } from '../../../../../../src/infrastructure/identity/uuid-v1'
import { Identity } from '../../../../../../src/domain/identity/identity'
import CreateDemo from '../../../../../../src/application/demo/create/create-demo'

describe('Update Store acceptance test', () => {
    let server: Server | null = null
    const app = new App()
    const route = '/admin/stores/update'

    beforeEach(async () => {
        app.boot()
        const parameters = app.getParameters()
        server = await app.startServer(parameters.get<number>('express.port'))
    })

    afterEach(async () => {
        await app.shutdown()
        server = null
    })

    function givenValidRequestBody(): any {
        return {
            attributes: {
                name: 'new-store-name'
            }
        }
    }

    async function givenExistingStore(id: Identity, sellerId: Identity): Promise<void> {
        const storeRepository = app.getContainer().get<StoreRepository>('storeRepository')

        await storeRepository.save(new Store({ id, name: 'store-name', sellerId }))
    }

    describe('GET method', () => {
        test('When valid request returns 200 status code', async () => {
            // Given
            const storeId = UuidV1.create()
            const sellerId = CreateDemo.FIXTURES.seller.id
            await givenExistingStore(storeId, new UuidV1(sellerId))

            // When
            const response = await request(server).get(route).send()

            // Then
            const expectedStatusCode = 200
            expect(response.statusCode).toEqual(expectedStatusCode)
        })
    })

    describe('POST method', () => {
        test('Redirect to store update when updated', async () => {
            // Given
            const storeId = UuidV1.create()
            const sellerId = CreateDemo.FIXTURES.seller.id
            await givenExistingStore(storeId, new UuidV1(sellerId))
            const requestBody = givenValidRequestBody()

            // When
            const response = await request(server).post(route).send(requestBody)

            // Then
            const expectedStatusCode = 302
            expect(response.statusCode).toEqual(expectedStatusCode)
        })

        test('Changes are persisted in repository when updated', async () => {
            // Given
            const storeId = UuidV1.create()
            const sellerId = CreateDemo.FIXTURES.seller.id
            await givenExistingStore(storeId, new UuidV1(sellerId))
            const requestBody = givenValidRequestBody()

            // When
            await request(server).post(route).send(requestBody)

            // Then
            const expectedName = 'new-store-name'
            const storeRepository = app.getContainer().get<StoreRepository>('storeRepository')
            const store = await storeRepository.get(storeId)
            expect(store.name).toEqual(expectedName)
        })

        test('When not existing store id returns 404 status code', async () => {
            // Given
            const requestBody = givenValidRequestBody()

            // When
            const response = await request(server).post(route).send(requestBody)

            // Then
            const expectedStatusCode = 404
            expect(response.statusCode).toEqual(expectedStatusCode)
        })
    })
})
