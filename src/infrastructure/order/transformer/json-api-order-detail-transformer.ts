import { OrderItemDetail } from '../../../application/order/find-by-customer-id/find-order-by-customer-id'
import { OrderDetail } from '../../../application/order/find-by-store-id/find-orders-by-store-id'
import JsonApiOrderItemTransformer from './json-api-order-item-transformer'

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

export default class JsonApiOrderDetailTransformer {
    constructor(private readonly jsonApiOrderItemTransformer: JsonApiOrderItemTransformer) {}

    async transformArray(orders: OrderDetail[]): Promise<JsonApiOrder[]> {
        const result = []

        for (const order of orders) {
            result.push(await this.transform(order))
        }

        return result
    }

    async transform(order: OrderDetail): Promise<JsonApiOrder> {
        const orderItems = await this.getOrderItems(order.items)

        return {
            id: order.id.value,
            attributes: {
                status: order.status,
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
