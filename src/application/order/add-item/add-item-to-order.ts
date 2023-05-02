import { Identity } from '../../../domain/identity/identity'
import { Order } from '../../../domain/order/order'
import { OrderStatus } from '../../../domain/order/order-status'
import { OrderRepository } from '../../../domain/order/repository/order-repository'
import { ProductRepository } from '../../../domain/product/repository/product-repository'
import { UuidV1 } from '../../../infrastructure/identity/uuid-v1'
import { AddItemToOrderCommand } from './add-item-to-order-command'

export default class AddItemToOrder {
    constructor (private readonly orderRepository: OrderRepository, private readonly productRepository: ProductRepository) {}

    async execute(command: AddItemToOrderCommand): Promise<void> {
        const order = await this.getOrder(command.customerId, command.orderItem.productId)

        const newOrder = order.addItem(command.orderItem)

        this.orderRepository.save(newOrder)
    }

    private async getOrder(customerId: Identity, productId: Identity): Promise<Order> {
        let order = await this.orderRepository.findByCustomerIdAndStatus(customerId, OrderStatus.draft)
        if (!order) {
            const product = await this.productRepository.get(productId)

            order = new Order({ id: UuidV1.create(), customerId, storeId: product.storeId })
        }

        return order
    }
}