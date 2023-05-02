import { Identity } from '../identity/identity'
import { OrderItem } from './order-item'
import { OrderStatus } from './order-status'

export class Order {
    readonly id: Identity
    readonly customerId: Identity
    readonly storeId: Identity
    readonly status: OrderStatus
    readonly items: OrderItem[]

    constructor({ id, customerId, storeId, status = OrderStatus.draft, items = [] }: { id: Identity, customerId: Identity, storeId: Identity, status?: OrderStatus, items?: OrderItem[] }) {
        this.id = id
        this.customerId = customerId
        this.storeId = storeId
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

    removeItem(productId: Identity): Order {
        const existingItemIndex = this.items.findIndex((i) => i.productId.equals(productId))
        const newItems = this.items

        if (existingItemIndex > -1) {
            newItems.splice(existingItemIndex, 1)
        }

        return new Order({ ...this, items: newItems })
    }

    changeStatus(newStatus: OrderStatus): Order {
        return new Order({ ...this, status: newStatus })
    }
}
