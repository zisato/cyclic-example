import AddItemToOrder from '../../../../../src/application/order/add-item/add-item-to-order'
import { UuidV1 } from '../../../../../src/infrastructure/identity/uuid-v1'
import { InterfaceMock } from '../../../../helpers/interface-mock'
import { OrderRepository } from '../../../../../src/domain/order/repository/order-repository'
import { ProductRepository } from '../../../../../src/domain/product/repository/product-repository'
import { Order } from '../../../../../src/domain/order/order'
import { AddItemToOrderCommand } from '../../../../../src/application/order/add-item/add-item-to-order-command'
import { OrderStatus } from '../../../../../src/domain/order/order-status'
import { Product } from '../../../../../src/domain/product/product'

describe('AddItemToOrder unit test suite', () => {
    const stubs = {
        orderRepository: {
            findByCustomerIdAndStatus: jest.fn(),
            save: jest.fn()
        } as InterfaceMock<OrderRepository>,
        productRepository: {
            get: jest.fn()
        } as InterfaceMock<ProductRepository>
    }
    const addItemToOrder = new AddItemToOrder(stubs.orderRepository, stubs.productRepository)

    test('Should call orderRepository.findByCustomerIdAndStatus once with arguments', async () => {
        const orderId = UuidV1.create()
        const customerId = UuidV1.create()
        const productId = UuidV1.create()
        const storeId = UuidV1.create()
        const quantity = 42
        const command = new AddItemToOrderCommand(customerId.value, productId.value, quantity)
        const order = new Order({ id: orderId, customerId, storeId })
        stubs.orderRepository.findByCustomerIdAndStatus.mockResolvedValue(order)

        await addItemToOrder.execute(command)

        const expectedTimes = 1
        const expectedArguments = [customerId, OrderStatus.draft]
        expect(stubs.orderRepository.findByCustomerIdAndStatus).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.orderRepository.findByCustomerIdAndStatus).toHaveBeenCalledWith(...expectedArguments)
    })

    test('Should call productRepository.get once with arguments when order not exists', async () => {
        const categoryId = UuidV1.create()
        const customerId = UuidV1.create()
        const productId = UuidV1.create()
        const storeId = UuidV1.create()
        const quantity = 42
        const command = new AddItemToOrderCommand(customerId.value, productId.value, quantity)
        const product = new Product({ id: productId, name: 'product-name', categoryId,  storeId })
        stubs.orderRepository.findByCustomerIdAndStatus.mockResolvedValue(undefined)
        stubs.productRepository.get.mockResolvedValueOnce(product)

        await addItemToOrder.execute(command)

        const expectedTimes = 1
        const expectedArguments = [productId]
        expect(stubs.productRepository.get).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.productRepository.get).toHaveBeenCalledWith(...expectedArguments)
    })

    test('Should call orderRepository.save once with arguments', async () => {
        const orderId = UuidV1.create()
        const customerId = UuidV1.create()
        const productId = UuidV1.create()
        const storeId = UuidV1.create()
        const quantity = 42
        const command = new AddItemToOrderCommand(customerId.value, productId.value, quantity)
        const order = new Order({ id: orderId, customerId, storeId })
        stubs.orderRepository.findByCustomerIdAndStatus.mockResolvedValue(order)

        await addItemToOrder.execute(command)

        const expectedTimes = 1
        const expectedArguments = expect.objectContaining({
            id: orderId,
            customerId,
            storeId,
            status: 'DRAFT',
            items: [
                {
                    productId,
                    quantity: 42
                }
            ]
        })
        expect(stubs.orderRepository.save).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.orderRepository.save).toHaveBeenCalledWith(expectedArguments)
    })
})
