import { Order } from '../../../domain/order/order'
import { OrderStatus } from '../../../domain/order/order-status'
import { OrderRepository } from '../../../domain/order/repository/order-repository'
import { UuidV1 } from '../../../infrastructure/identity/uuid-v1'
import { FindOrderByCustomerIdCommand } from './find-order-by-customer-id-command'

export default class FindOrderByCustomerId {
    constructor (private readonly orderRepository: OrderRepository) {}

    async execute(command: FindOrderByCustomerIdCommand): Promise<Order> {
        let order = await this.orderRepository.findByCustomerIdAndStatus(command.customerId, OrderStatus.draft)
        if (!order) {
            order = new Order({ id: UuidV1.create(), customerId: command.customerId })

            await this.orderRepository.save(order)
        }

        return order
    }
}
