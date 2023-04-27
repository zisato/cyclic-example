import { Identity } from "../identity/identity"

export class OrderItem {
    readonly productId: Identity
    readonly quantity: number

    constructor({ productId, quantity }: { productId: Identity, quantity: number }) {
        this.productId = productId
        this.quantity = quantity
    }
}
