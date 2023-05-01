import { Identity } from '../../../domain/identity/identity'
import { Order } from '../../../domain/order/order'
import { OrderStatus } from '../../../domain/order/order-status'
import { OrderRepository } from '../../../domain/order/repository/order-repository'
import { CompleteOrderCommand } from './complete-order-command'

export default class CompleteOrder {
    constructor(private readonly orderRepository: OrderRepository) {}

    async execute(command: CompleteOrderCommand): Promise<void> {
        let order = await this.orderRepository.get(command.orderId)
        this.ensureOrderCustomer(order, command.customerId)

        order = order.changeStatus(OrderStatus.draft)

        await this.orderRepository.save(order)
    }

    private ensureOrderCustomer(order: Order, customerId: Identity): void {
        if (order.customerId !== customerId) {
            throw new Error('Invalid order customer')
        }
    }
}
