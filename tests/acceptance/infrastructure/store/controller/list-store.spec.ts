import { Server } from 'http'
import request from 'supertest'
import { App } from '../../../../../src/app'
import { Store } from '../../../../../src/domain/store/store'
import { StoreRepository } from '../../../../../src/domain/store/repository/store-repository'
import { UuidV1 } from '../../../../../src/infrastructure/identity/uuid-v1'
import { Identity } from '../../../../../src/domain/identity/identity'
import CreateDemo from '../../../../../src/application/demo/create/create-demo'

describe('ListStore acceptance test', () => {
    let server: Server | null = null
    const app = new App()
    const route = '/stores'

    beforeEach(async () => {
        app.boot()
        const parameters = app.getParameters()
        server = await app.startServer(parameters.get<number>('express.port'))
    })

    afterEach(async () => {
        await app.shutdown()
        server = null
    })

    async function givenExistingStore(id: Identity, sellerId: Identity): Promise<void> {
        const storeRepository = app.getContainer().get<StoreRepository>('storeRepository')

        await storeRepository.save(new Store({ id, name: 'store-name', sellerId }))
    }

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
