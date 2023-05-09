import { OrderDetail, OrderItemDetail } from '../../../application/order/find-by-customer-id/find-order-by-customer-id'
import JsonApiOrderItemTransformer from './json-api-order-item-transformer'

type JsonApiOrderItem = {
    productId: string
    name: string
    quantity: number
    image: string | null
}

export type JsonApiOrder = {
    id: string
    attributes: {
        items: JsonApiOrderItem[]
    }
}

export default class JsonApiOrderTransformer {
    constructor(private readonly jsonApiOrderItemTransformer: JsonApiOrderItemTransformer) {}

    transform(order: OrderDetail): JsonApiOrder {
        const orderItems = this.getOrderItems(order.items)

        return {
            id: order.id.value,
            attributes: {
                items: orderItems
            }
        }
    }

    private getOrderItems(items: OrderItemDetail[]): JsonApiOrderItem[] {
        const result: JsonApiOrderItem[] = []

        for (const item of items) {
            const jsonApiOrderItemDetail = this.jsonApiOrderItemTransformer.transform(item)

            result.push(jsonApiOrderItemDetail)
        }

        return result
    }
}
