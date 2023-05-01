import { Identity } from '../identity/identity'
import { OrderItem } from './order-item'
import { OrderStatus } from './order-status'

export class Order {
    readonly id: Identity
    readonly customerId: Identity
    readonly status: OrderStatus
    readonly items: OrderItem[]

    constructor({ id, customerId, status = OrderStatus.draft, items = [] }: { id: Identity, customerId: Identity, status?: OrderStatus, items?: OrderItem[] }) {
        this.id = id
        this.customerId = customerId
        this.status = status
        this.items = items
    }

    addItem(item: OrderItem): Order {
        const existingItemIndex = this.items.findIndex((i) => i.productId.equals(item.productId))
        const newItems = this.items

        if (existingItemIndex > -1) {
            const existingItem = newItems[existingItemIndex]
            const newQuantity = existingItem.quantity + item.quantity

            newItems[existingItemIndex] = new OrderItem({ productId: item.productId, quantity: newQuantity })
        } else {
            newItems.push(item)
        }

        return new Order({ ...this, items: newItems })
    }

    changeStatus(newStatus: OrderStatus): Order {
        return new Order({ ...this, status: newStatus })
    }
}
