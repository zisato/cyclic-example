import { Order } from '../../../domain/order/order'

type JsonApiOrderItem = {
    productId: string
    quantity: number
}

type JsonApiOrder = {
    id: string
    attributes: {
        items: JsonApiOrderItem[]
    }
}

export class JsonApiOrderTransformer {
    static transform(order: Order): JsonApiOrder {
        const orderItems = order.items.map((orderItem) => {
            return {
                productId: orderItem.productId.value,
                quantity: orderItem.quantity
            }
        })

        return {
            id: order.id.value,
            attributes: {
                items: orderItems
            }
        }
    }
}
