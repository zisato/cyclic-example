export class OrderItem {
    readonly productId: string
    readonly quantity: number

    constructor({ productId, quantity }: { productId: string, quantity: number }) {
        this.productId = productId
        this.quantity = quantity
    }
}
