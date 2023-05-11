import { Server } from 'http'
import request from 'supertest'
import { App } from '../../../../../src/app'
import { UuidV1 } from '../../../../../src/infrastructure/identity/uuid-v1'
import { Identity } from '../../../../../src/domain/identity/identity'
import CreateDemo from '../../../../../src/application/demo/create/create-demo'
import { OrderRepository } from '../../../../../src/domain/order/repository/order-repository'
import { Order } from '../../../../../src/domain/order/order'
import { OrderItem } from '../../../../../src/domain/order/order-item'
import { OrderStatus } from '../../../../../src/domain/order/order-status'

describe('Complete Order acceptance test', () => {
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

    function givenRoute(orderId: string): string {
      return `/cart/${orderId}/complete`
    }

    async function givenExistingOrder(id: Identity, customerId: Identity, storeId: Identity, items: OrderItem[] = []): Promise<void> {
      const orderRepository = app.getContainer().get<OrderRepository>('orderRepository')
  
      await orderRepository.save(new Order({ id: id, customerId, storeId, items }))
    }

    test('Redirect to previous url when item removed', async () => {
        // Given
        const orderId = UuidV1.create()
        const customerId = CreateDemo.FIXTURES.customer.id
        const storeId = CreateDemo.FIXTURES.store.id
        const productId = CreateDemo.FIXTURES.products[0].id
        const quantity = 42
        const items = [
            new OrderItem({ productId: new UuidV1(productId), quantity })
        ]
        await givenExistingOrder(orderId, new UuidV1(customerId), new UuidV1(storeId), items)
        const route = givenRoute(orderId.value)

        // When
        const response = await request(server).post(route).send()

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
        const items = [
            new OrderItem({ productId: new UuidV1(productId), quantity })
        ]
        await givenExistingOrder(orderId, new UuidV1(customerId), new UuidV1(storeId), items)
        const route = givenRoute(orderId.value)

        // When
        await request(server).post(route).send()

        // Then
        const expectedStatus = OrderStatus.pending
        const orderRepository = app.getContainer().get<OrderRepository>('orderRepository')
        const order = await orderRepository.get(orderId)
        expect(order.status).toEqual(expectedStatus)
    })

    test('When not existing product id returns 404 status code', async () => {
        // Given
        const route = givenRoute(UuidV1.create().value)

        // When
        const response = await request(server).delete(route).send()

        // Then
        const expectedStatusCode = 404
        expect(response.statusCode).toEqual(expectedStatusCode)
    })
})
