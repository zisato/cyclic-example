import { OrderItem } from '../../../domain/order/order-item'

export class AddItemToOrderCommand {
    readonly orderItem: OrderItem

    constructor(readonly customerId: string, productId: string, quantity: number) {
        this.orderItem = new OrderItem({ productId, quantity })
    }
}
