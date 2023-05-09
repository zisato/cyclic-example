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

    transformArray(orders: OrderDetail[]): JsonApiOrder[] {
        return orders.map((orderDetail: OrderDetail) => {
            return this.transform(orderDetail)
        })
    }

    transform(order: OrderDetail): JsonApiOrder {
        const orderItems = this.getOrderItems(order.items)

        return {
            id: order.id.value,
            attributes: {
                status: order.status,
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
