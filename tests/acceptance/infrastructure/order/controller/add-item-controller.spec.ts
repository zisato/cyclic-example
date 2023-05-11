import { Server } from 'http'
import request from 'supertest'
import { App } from '../../../../../src/app'
import { UuidV1 } from '../../../../../src/infrastructure/identity/uuid-v1'
import { Identity } from '../../../../../src/domain/identity/identity'
import CreateDemo from '../../../../../src/application/demo/create/create-demo'
import { OrderRepository } from '../../../../../src/domain/order/repository/order-repository'
import { Order } from '../../../../../src/domain/order/order'

describe('Add Item to Order acceptance test', () => {
    let server: Server | null = null
    const app = new App()

    beforeEach(() => {
        app.boot()
        const parameters = app.getParameters()
        server = app.startServer(parameters.get<number>('express.port'))
    })

    afterEach(() => {
        app.shutdown()
        server = null
    })

    function givenRoute(): string {
      return `/cart/items`
    }

    function givenValidRequestBody(productId: string, quantity: number): any {
        return {
            attributes: {
                product: {
                    id: productId,
                    quantity
                }
            }
        }
    }

    async function givenExistingOrder(id: Identity, customerId: Identity, storeId: Identity): Promise<void> {
      const orderRepository = app.getContainer().get<OrderRepository>('orderRepository')
  
      await orderRepository.save(new Order({ id: id, customerId, storeId }))
    }

    test('Redirect to previous url when item added', async () => {
        // Given
        const orderId = UuidV1.create()
        const customerId = CreateDemo.FIXTURES.customer.id
        const storeId = CreateDemo.FIXTURES.store.id
        const productId = CreateDemo.FIXTURES.products[0].id
        const quantity = 42
        await givenExistingOrder(orderId, new UuidV1(customerId), new UuidV1(storeId))
        const requestBody = givenValidRequestBody(productId, quantity)
        const route = givenRoute()

        // When
        const response = await request(server).post(route).send(requestBody)

        // Then
        const expectedStatusCode = 302
        expect(response.statusCode).toEqual(expectedStatusCode)
    })

    test('Changes are persisted in repository when updated', async () => {
        // Given
        const orderId = UuidV1.create()
        const customerId = CreateDemo.FIXTURES.customer.id
        const storeId = CreateDemo.FIXTURES.store.id
        const productId = CreateDemo.FIXTURES.products[0].id
        const quantity = 42
        await givenExistingOrder(orderId, new UuidV1(customerId), new UuidV1(storeId))
        const requestBody = givenValidRequestBody(productId, quantity)
        const route = givenRoute()

        // When
        await request(server).post(route).send(requestBody)

        // Then
        const expectedItems = [
            {
                productId: new UuidV1(productId),
                quantity
            }
        ]
        const orderRepository = app.getContainer().get<OrderRepository>('orderRepository')
        const order = await orderRepository.get(orderId)
        expect(order.items).toEqual(expectedItems)
    })

    test('When not existing product id returns 404 status code', async () => {
        // Given
        const requestBody = givenValidRequestBody(UuidV1.create().value, 42)
        const route = givenRoute()

        // When
        const response = await request(server).post(route).send(requestBody)

        // Then
        const expectedStatusCode = 404
        expect(response.statusCode).toEqual(expectedStatusCode)
    })
})
