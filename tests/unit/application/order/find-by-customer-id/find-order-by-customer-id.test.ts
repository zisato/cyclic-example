import FindOrderByCustomerId from '../../../../../src/application/order/find-by-customer-id/find-order-by-customer-id'
import { UuidV1 } from '../../../../../src/infrastructure/identity/uuid-v1'
import { InterfaceMock } from '../../../../helpers/interface-mock'
import { OrderRepository } from '../../../../../src/domain/order/repository/order-repository'
import { Order } from '../../../../../src/domain/order/order'
import { ProductRepository } from '../../../../../src/domain/product/repository/product-repository'
import { FindOrderByCustomerIdQuery } from '../../../../../src/application/order/find-by-customer-id/find-order-by-customer-id-query'
import { OrderStatus } from '../../../../../src/domain/order/order-status'
import { OrderItem } from '../../../../../src/domain/order/order-item'
import { Product } from '../../../../../src/domain/product/product'

describe('FindOrderByCustomerId unit test suite', () => {
    const stubs = {
        orderRepository: {
            findByCustomerIdAndStatus: jest.fn(),
            save: jest.fn()
        } as InterfaceMock<OrderRepository>,
        productRepository: {
            get: jest.fn()
        } as InterfaceMock<ProductRepository>
    }
    const findOrderByCustomerId = new FindOrderByCustomerId(stubs.orderRepository, stubs.productRepository)

    test('Should call orderRepository.findByCustomerIdAndStatus once with arguments', async () => {
        const customerId = UuidV1.create()
        const query = new FindOrderByCustomerIdQuery(customerId.value)
        stubs.orderRepository.findByCustomerIdAndStatus.mockResolvedValueOnce(undefined)

        await findOrderByCustomerId.execute(query)

        const expectedTimes = 1
        const expectedArguments = [customerId, OrderStatus.draft]
        expect(stubs.orderRepository.findByCustomerIdAndStatus).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.orderRepository.findByCustomerIdAndStatus).toHaveBeenCalledWith(...expectedArguments)
    })
    
    test('Should return null when order not exists', async () => {
        const customerId = UuidV1.create()
        const query = new FindOrderByCustomerIdQuery(customerId.value)
        stubs.orderRepository.findByCustomerIdAndStatus.mockResolvedValueOnce(undefined)

        const result = await findOrderByCustomerId.execute(query)

        const expectedResult = null
        expect(result).toEqual(expectedResult)
    })

    test('Should call productRepository.get each product item with arguments', async () => {
        const orderId = UuidV1.create()
        const customerId = UuidV1.create()
        const categoryId = UuidV1.create()
        const storeId = UuidV1.create()
        const product1Id = UuidV1.create()
        const product2Id = UuidV1.create()
        const orderItems = [
            new OrderItem({ productId: product1Id, quantity: 23 }),
            new OrderItem({ productId: product2Id, quantity: 42 }),
        ]
        const product1 = new Product({ id: product1Id, name: 'product-1-name', categoryId, storeId })
        const product2 = new Product({ id: product2Id, name: 'product-2-name', categoryId, storeId })
        const query = new FindOrderByCustomerIdQuery(customerId.value)
        const order = new Order({ id: orderId, customerId: UuidV1.create(), storeId, items: orderItems })
        stubs.orderRepository.findByCustomerIdAndStatus.mockResolvedValue(order)
        stubs.productRepository.get.mockResolvedValueOnce(product1).mockResolvedValueOnce(product2)

        await findOrderByCustomerId.execute(query)

        const expectedTimes = 2
        const expectedArguments = [product1Id, product2Id]
        expect(stubs.productRepository.get).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.productRepository.get).toHaveBeenNthCalledWith(1, expectedArguments[0])
        expect(stubs.productRepository.get).toHaveBeenNthCalledWith(2, expectedArguments[1])
    })

    test('Should return valid result', async () => {
        const orderId = UuidV1.create()
        const customerId = UuidV1.create()
        const categoryId = UuidV1.create()
        const storeId = UuidV1.create()
        const product1Id = UuidV1.create()
        const product2Id = UuidV1.create()
        const orderItems = [
            new OrderItem({ productId: product1Id, quantity: 23 }),
            new OrderItem({ productId: product2Id, quantity: 42 }),
        ]
        const product1 = new Product({ id: product1Id, name: 'product-1-name', categoryId, storeId })
        const product2 = new Product({ id: product2Id, name: 'product-2-name', categoryId, storeId })
        const query = new FindOrderByCustomerIdQuery(customerId.value)
        const order = new Order({ id: orderId, customerId: UuidV1.create(), storeId, items: orderItems })
        stubs.orderRepository.findByCustomerIdAndStatus.mockResolvedValue(order)
        stubs.productRepository.get.mockResolvedValueOnce(product1).mockResolvedValueOnce(product2)

        const result = await findOrderByCustomerId.execute(query)

        const expectedResult = {
            id: orderId,
            items: [
                {
                    productId: product1Id.value,
                    name: 'product-1-name',
                    quantity: 23,
                    image: null
                },
                {
                    productId: product2Id.value,
                    name: 'product-2-name',
                    quantity: 42,
                    image: null
                }
            ]
        }
        expect(result).toEqual(expectedResult)
    })
})
