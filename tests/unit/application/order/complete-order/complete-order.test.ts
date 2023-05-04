import CompleteOrder from '../../../../../src/application/order/complete-order/complete-order'
import { UuidV1 } from '../../../../../src/infrastructure/identity/uuid-v1'
import { InterfaceMock } from '../../../../helpers/interface-mock'
import { OrderRepository } from '../../../../../src/domain/order/repository/order-repository'
import { Order } from '../../../../../src/domain/order/order'
import { CompleteOrderCommand } from '../../../../../src/application/order/complete-order/complete-order-command'

describe('CompleteOrder unit test suite', () => {
    const stubs = {
        orderRepository: {
            get: jest.fn(),
            save: jest.fn()
        } as InterfaceMock<OrderRepository>
    }
    const completeOrder = new CompleteOrder(stubs.orderRepository)

    test('Should call orderRepository.get once with arguments', async () => {
        const orderId = UuidV1.create()
        const customerId = UuidV1.create()
        const storeId = UuidV1.create()
        const command = new CompleteOrderCommand(orderId.value, customerId.value)
        const order = new Order({ id: orderId, customerId, storeId })
        stubs.orderRepository.get.mockResolvedValue(order)

        await completeOrder.execute(command)

        const expectedTimes = 1
        const expectedArguments = [orderId]
        expect(stubs.orderRepository.get).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.orderRepository.get).toHaveBeenCalledWith(...expectedArguments)
    })

    test('Should throw error when order invalid customer', async () => {
        const orderId = UuidV1.create()
        const customerId = UuidV1.create()
        const storeId = UuidV1.create()
        const command = new CompleteOrderCommand(orderId.value, customerId.value)
        const order = new Order({ id: orderId, customerId: UuidV1.create(), storeId })
        stubs.orderRepository.get.mockResolvedValue(order)

        const promise = completeOrder.execute(command)

        const expectedError = new Error('Invalid order customer')
        expect(promise).rejects.toThrowError(expectedError)
    })

    test('Should call orderRepository.save once with arguments', async () => {
        const orderId = UuidV1.create()
        const customerId = UuidV1.create()
        const storeId = UuidV1.create()
        const command = new CompleteOrderCommand(orderId.value, customerId.value)
        const order = new Order({ id: orderId, customerId, storeId })
        stubs.orderRepository.get.mockResolvedValue(order)

        await completeOrder.execute(command)

        const expectedTimes = 1
        const expectedArguments = [
            {
                id: orderId,
                customerId,
                storeId,
                status: 'PENDING',
                items: []
            }
        ]
        expect(stubs.orderRepository.save).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.orderRepository.save).toHaveBeenCalledWith(...expectedArguments)
    })
})
