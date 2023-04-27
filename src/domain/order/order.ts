import { Identity } from "../identity/identity"
import { OrderItem } from "./order-item"

export class Order {
    readonly id: Identity
    readonly customerId: Identity
    readonly items: OrderItem[]

    constructor({ id, customerId, items = [] }: { id: Identity, customerId: Identity, items?: OrderItem[] }) {
        this.id = id
        this.customerId = customerId
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
}
