import RemoveItemFromOrder from '../../../../../src/application/order/remove-item/remove-item-from-order'
import { UuidV1 } from '../../../../../src/infrastructure/identity/uuid-v1'
import { InterfaceMock } from '../../../../helpers/interface-mock'
import { OrderRepository } from '../../../../../src/domain/order/repository/order-repository'
import { Order } from '../../../../../src/domain/order/order'
import { RemoveItemFromOrderCommand } from '../../../../../src/application/order/remove-item/remove-item-from-order-command'
import { OrderStatus } from '../../../../../src/domain/order/order-status'
import { ModelNotFoundError } from '../../../../../src/domain/error/model-not-found-error'
import { OrderItem } from '../../../../../src/domain/order/order-item'

describe('RemoveItemFromOrder unit test suite', () => {
    const stubs = {
        orderRepository: {
            findByCustomerIdAndStatus: jest.fn(),
            save: jest.fn()
        } as InterfaceMock<OrderRepository>
    }
    const removeItemFromOrder = new RemoveItemFromOrder(stubs.orderRepository)

    test('Should call orderRepository.findByCustomerIdAndStatus once with arguments', async () => {
        const orderId = UuidV1.create()
        const customerId = UuidV1.create()
        const productId = UuidV1.create()
        const storeId = UuidV1.create()
        const command = new RemoveItemFromOrderCommand(customerId.value, productId.value)
        const order = new Order({ id: orderId, customerId, storeId })
        stubs.orderRepository.findByCustomerIdAndStatus.mockResolvedValue(order)

        await removeItemFromOrder.execute(command)

        const expectedTimes = 1
        const expectedArguments = [customerId, OrderStatus.draft]
        expect(stubs.orderRepository.findByCustomerIdAndStatus).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.orderRepository.findByCustomerIdAndStatus).toHaveBeenCalledWith(...expectedArguments)
    })

    test('Should throw error when order not exists', async () => {
        const customerId = UuidV1.create()
        const productId = UuidV1.create()
        const command = new RemoveItemFromOrderCommand(customerId.value, productId.value)
        stubs.orderRepository.findByCustomerIdAndStatus.mockResolvedValue(undefined)

        const promise = removeItemFromOrder.execute(command)

        const expectedError = new ModelNotFoundError(`Order for customer ${customerId.value} not found`)
        await expect(promise).rejects.toThrowError(expectedError)
    })

    test('Should call orderRepository.save once with arguments', async () => {
        const orderId = UuidV1.create()
        const customerId = UuidV1.create()
        const productId = UuidV1.create()
        const storeId = UuidV1.create()
        const items = [
            new OrderItem({ productId, quantity: 1 })
        ]
        const command = new RemoveItemFromOrderCommand(customerId.value, productId.value)
        const order = new Order({ id: orderId, customerId, storeId, items })
        stubs.orderRepository.findByCustomerIdAndStatus.mockResolvedValue(order)

        await removeItemFromOrder.execute(command)

        const expectedTimes = 1
        const expectedArguments = expect.objectContaining({
            id: orderId,
            customerId,
            storeId,
            status: 'DRAFT',
            items: []
        })
        expect(stubs.orderRepository.save).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.orderRepository.save).toHaveBeenCalledWith(expectedArguments)
    })
})
