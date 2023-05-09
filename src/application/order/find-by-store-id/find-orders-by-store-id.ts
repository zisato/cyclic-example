import { Identity } from '../../../domain/identity/identity'
import { Order } from '../../../domain/order/order'
import { OrderItem } from '../../../domain/order/order-item'
import { OrderStatus } from '../../../domain/order/order-status'
import { OrderRepository } from '../../../domain/order/repository/order-repository'
import { ProductRepository } from '../../../domain/product/repository/product-repository'
import { FindOrdersByStoreIdQuery } from './find-orders-by-store-id-query'

type OrderItemDetail = {
    productId: string
    name: string
    quantity: number
    image: string | null
}
export type OrderDetail = {
    id: Identity
    status: OrderStatus
    items: OrderItemDetail[]
}

export default class FindOrdersByStoreId {
    constructor (private readonly orderRepository: OrderRepository, private readonly productRepository: ProductRepository) {}

    async execute(command: FindOrdersByStoreIdQuery): Promise<OrderDetail[]> {
        const orders = await this.orderRepository.findByStoreId(command.storeId)

        const orderDetails = this.getOrderDetails(orders)

        return orderDetails
    }

    private async getOrderDetails(orders: Order[]): Promise<OrderDetail[]> {
        const orderDetails: OrderDetail[] = []
        for (const order of orders) {
            const orderItems = await this.getOrderItemsDetail(order.items)
            const orderDetail = {
                id: order.id,
                status: order.status,
                items: orderItems
            }

            orderDetails.push(orderDetail)
        }

        return orderDetails
    }

    private async getOrderItemsDetail(orderItems: OrderItem[]): Promise<OrderItemDetail[]> {
        const result = []
        for (const orderItem of orderItems) {
            const product = await this.productRepository.get(orderItem.productId)

            result.push({
                productId: product.id.value,
                name: product.name,
                quantity: orderItem.quantity,
                image: product.imageFilename
            })
        }

        return result
    }
}
