import { OrderDetail } from '../../../application/order/find-by-customer-id/find-order-by-customer-id'

type JsonApiOrderItem = {
    name: string
    quantity: number
    image: string | null
}

type JsonApiOrder = {
    id: string
    attributes: {
        items: JsonApiOrderItem[]
    }
}

export class JsonApiOrderTransformer {
    static transform(order: OrderDetail): JsonApiOrder {
        const orderItems = order.items.map((orderItem) => {
            return {
                name: orderItem.name,
                image: orderItem.image,
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
