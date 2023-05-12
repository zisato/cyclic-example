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

    async transform(order: OrderDetail): Promise<JsonApiOrder> {
        const orderItems = await this.getOrderItems(order.items)

        return {
            id: order.id.value,
            attributes: {
                items: orderItems
            }
        }
    }

    private async getOrderItems(items: OrderItemDetail[]): Promise<JsonApiOrderItem[]> {
        const result: JsonApiOrderItem[] = []

        for (const item of items) {
            const jsonApiOrderItemDetail = await this.jsonApiOrderItemTransformer.transform(item)

            result.push(jsonApiOrderItemDetail)
        }

        return result
    }
}
