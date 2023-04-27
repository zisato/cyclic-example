import { Identity } from '../../../domain/identity/identity'
import { OrderItem } from '../../../domain/order/order-item'
import { UuidV1 } from '../../../infrastructure/identity/uuid-v1'

export class AddItemToOrderCommand {
    readonly customerId: Identity
    readonly orderItem: OrderItem

    constructor(customerId: string, productId: string, quantity: number) {
        this.customerId = new UuidV1(customerId)
        this.orderItem = new OrderItem({ productId: new UuidV1(productId), quantity })
    }
}
