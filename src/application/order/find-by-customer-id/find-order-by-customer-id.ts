import { Identity } from '../../../domain/identity/identity'
import { OrderItem } from '../../../domain/order/order-item'
import { OrderStatus } from '../../../domain/order/order-status'
import { OrderRepository } from '../../../domain/order/repository/order-repository'
import { ProductRepository } from '../../../domain/product/repository/product-repository'
import { FindOrderByCustomerIdQuery } from './find-order-by-customer-id-query'

type OrderItemDetail = {
    productId: string
    name: string
    quantity: number
    image: string | null
}
export type OrderDetail = {
    id: Identity
    items: OrderItemDetail[]
}

export default class FindOrderByCustomerId {
    constructor (private readonly orderRepository: OrderRepository, private readonly productRepository: ProductRepository) {}

    async execute(query: FindOrderByCustomerIdQuery): Promise<OrderDetail | null> {
        let order = await this.orderRepository.findByCustomerIdAndStatus(query.customerId, OrderStatus.draft)
        if (!order) {
            return null
        }

        const orderItems = await this.getOrderItemsDetail(order.items)

        return {
            id: order.id,
            items: orderItems
        }
    }

    private async getOrderItemsDetail(orderItems: OrderItem[]): Promise<OrderItemDetail[]> {
        const result = []
        for (const orderItem of orderItems) {
            const product = await this.productRepository.get(orderItem.productId)

            result.push({
                productId: product.id.value,
                name: product.name,
                quantity: orderItem.quantity,
                image: product.imageAsDataUrl()
            })
        }

        return result
    }
}
