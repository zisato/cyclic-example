import { Identity } from '../../../domain/identity/identity'
import { Order } from '../../../domain/order/order'
import { OrderItem } from '../../../domain/order/order-item'
import { OrderStatus } from '../../../domain/order/order-status'
import { OrderRepository } from '../../../domain/order/repository/order-repository'
import { ProductRepository } from '../../../domain/product/repository/product-repository'
import { UuidV1 } from '../../../infrastructure/identity/uuid-v1'
import { FindOrderByCustomerIdCommand } from './find-order-by-customer-id-command'

type OrderItemDetail = {
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

    async execute(command: FindOrderByCustomerIdCommand): Promise<OrderDetail> {
        let order = await this.orderRepository.findByCustomerIdAndStatus(command.customerId, OrderStatus.draft)
        if (!order) {
            order = new Order({ id: UuidV1.create(), customerId: command.customerId })

            await this.orderRepository.save(order)
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
                name: product.name,
                quantity: orderItem.quantity,
                image: product.imageAsDataUrl()
            })
        }

        return result
    }
}
