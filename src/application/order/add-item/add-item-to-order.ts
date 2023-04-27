import { Identity } from '../../../domain/identity/identity'
import { Order } from '../../../domain/order/order'
import { OrderRepository } from '../../../domain/order/repository/order-repository'
import { UuidV1 } from '../../../infrastructure/identity/uuid-v1'
import { AddItemToOrderCommand } from './add-item-to-order-command'

export default class AddItemToOrder {
    constructor (private readonly orderRepository: OrderRepository) {}

    async execute(command: AddItemToOrderCommand): Promise<void> {
        const order = await this.getOrder(command.customerId)

        const newOrder = order.addItem(command.orderItem)

        this.orderRepository.save(newOrder)
    }

    private async getOrder(customerId: Identity): Promise<Order> {
        let order = await this.orderRepository.findByCustomerId(customerId)
        if (!order) {
            order = new Order({ id: UuidV1.create(), customerId })
        }

        return order
    }
}