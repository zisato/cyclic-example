import { ModelNotFoundError } from '../../../domain/error/model-not-found-error'
import { Identity } from '../../../domain/identity/identity'
import { Order } from '../../../domain/order/order'
import { OrderStatus } from '../../../domain/order/order-status'
import { OrderRepository } from '../../../domain/order/repository/order-repository'

export default class InMemoryOrderRepository implements OrderRepository {
    private readonly data: Order[] = []
    
    async findByCustomerIdAndStatus(customerId: Identity, status: OrderStatus): Promise<Order | undefined> {
        return this.data.find((order: Order) => {
            return order.customerId.equals(customerId) && order.status === status
        })
    }

    async findByStoreId(storeId: Identity): Promise<Order[]> {
        return this.data.filter((order: Order) => {
            return order.storeId.equals(storeId)
        })
    }

    async get (id: Identity): Promise<Order> {
        const existingOrderIndex = this.data.findIndex((order: Order) => {
            return order.id.equals(id)
        })

        if (existingOrderIndex === -1) {
            throw new ModelNotFoundError(`Order with id ${id.value} not found`)
        }

        return this.data[existingOrderIndex]
    }

    async save (order: Order): Promise<void> {
        const existingOrderIndex = this.data.findIndex((data: Order) => {
            return data.id === order.id
        })

        if (existingOrderIndex >= 0) {
            this.data[existingOrderIndex] = order
        } else {
            this.data.push(order)
        }
    }
}
