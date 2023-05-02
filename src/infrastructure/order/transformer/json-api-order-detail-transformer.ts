import { OrderDetail } from "../../../application/order/find-by-store-id/find-orders-by-store-id"

type JsonApiOrderItem = {
    productId: string
    name: string
    quantity: number
    image: string | null
}

type JsonApiOrder = {
    id: String
    attributes: {
        status: string
        items: JsonApiOrderItem[]
    }
}

export class JsonApiOrderDetailTransformer {
    static transform(order: OrderDetail): JsonApiOrder {
        const orderItems = order.items.map((orderItem) => {
            return {
                productId: orderItem.productId,
                name: orderItem.name,
                image: orderItem.image,
                quantity: orderItem.quantity
            }
        })

        return {
            id: order.id.value,
            attributes: {
                status: order.status,
                items: orderItems
            }
        }
    }
}
