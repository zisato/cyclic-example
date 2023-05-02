import { ModelNotFoundError } from '../../../domain/error/model-not-found-error'
import { Identity } from '../../../domain/identity/identity'
import { Order } from '../../../domain/order/order'
import { OrderStatus } from '../../../domain/order/order-status'
import { OrderRepository } from '../../../domain/order/repository/order-repository'
import { RemoveItemFromOrderCommand } from './remove-item-from-order-command'

export default class RemoveItemFromOrder {
    constructor (private readonly orderRepository: OrderRepository) {}

    async execute(command: RemoveItemFromOrderCommand): Promise<void> {
        const order = await this.getOrder(command.customerId)

        const newOrder = order.removeItem(command.productId)

        this.orderRepository.save(newOrder)
    }

    private async getOrder(customerId: Identity): Promise<Order> {
        const order = await this.orderRepository.findByCustomerIdAndStatus(customerId, OrderStatus.draft)
        if (!order) {
            throw new ModelNotFoundError(`Order for customer ${customerId.value} not found`)
        }

        return order
    }
}