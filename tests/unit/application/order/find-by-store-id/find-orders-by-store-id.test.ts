import FindOrdersByStoreId from '../../../../../src/application/order/find-by-store-id/find-orders-by-store-id'
import { UuidV1 } from '../../../../../src/infrastructure/identity/uuid-v1'
import { InterfaceMock } from '../../../../helpers/interface-mock'
import { OrderRepository } from '../../../../../src/domain/order/repository/order-repository'
import { Order } from '../../../../../src/domain/order/order'
import { ProductRepository } from '../../../../../src/domain/product/repository/product-repository'
import { OrderStatus } from '../../../../../src/domain/order/order-status'
import { OrderItem } from '../../../../../src/domain/order/order-item'
import { Product } from '../../../../../src/domain/product/product'
import { FindOrdersByStoreIdQuery } from '../../../../../src/application/order/find-by-store-id/find-orders-by-store-id-query'

describe('FindOrdersByStoreId unit test suite', () => {
    const stubs = {
        orderRepository: {
            findByStoreId: jest.fn(),
            save: jest.fn()
        } as InterfaceMock<OrderRepository>,
        productRepository: {
            get: jest.fn()
        } as InterfaceMock<ProductRepository>
    }
    const findOrdersByStoreId = new FindOrdersByStoreId(stubs.orderRepository, stubs.productRepository)

    test('Should call orderRepository.findByStoreId once with arguments', async () => {
        const storeId = UuidV1.create()
        const query = new FindOrdersByStoreIdQuery(storeId.value)
        stubs.orderRepository.findByStoreId.mockResolvedValueOnce([])

        await findOrdersByStoreId.execute(query)

        const expectedTimes = 1
        const expectedArguments = [storeId]
        expect(stubs.orderRepository.findByStoreId).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.orderRepository.findByStoreId).toHaveBeenCalledWith(...expectedArguments)
    })
    
    test('Should return empty array when no orders for storeId', async () => {
        const storeId = UuidV1.create()
        const query = new FindOrdersByStoreIdQuery(storeId.value)
        stubs.orderRepository.findByStoreId.mockResolvedValueOnce([])

        const result = await findOrdersByStoreId.execute(query)

        const expectedResult: Order[] = []
        expect(result).toEqual(expectedResult)
    })

    test('Should call productRepository.get each product item with arguments', async () => {
        const orderId = UuidV1.create()
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
        const query = new FindOrdersByStoreIdQuery(storeId.value)
        const order = new Order({ id: orderId, customerId: UuidV1.create(), storeId, items: orderItems })
        stubs.orderRepository.findByStoreId.mockResolvedValue([order])
        stubs.productRepository.get.mockResolvedValueOnce(product1).mockResolvedValueOnce(product2)

        await findOrdersByStoreId.execute(query)

        const expectedTimes = 2
        const expectedArguments = [product1Id, product2Id]
        expect(stubs.productRepository.get).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.productRepository.get).toHaveBeenNthCalledWith(1, expectedArguments[0])
        expect(stubs.productRepository.get).toHaveBeenNthCalledWith(2, expectedArguments[1])
    })

    test('Should return valid result', async () => {
        const orderId = UuidV1.create()
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
        const query = new FindOrdersByStoreIdQuery(storeId.value)
        const order = new Order({ id: orderId, customerId: UuidV1.create(), storeId, items: orderItems, status: OrderStatus.pending })
        stubs.orderRepository.findByStoreId.mockResolvedValue([order])
        stubs.productRepository.get.mockResolvedValueOnce(product1).mockResolvedValueOnce(product2)

        const result = await findOrdersByStoreId.execute(query)

        const expectedResult = [
            {
                id: orderId,
                status: 'PENDING',
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
        ]
        expect(result).toEqual(expectedResult)
    })
})
