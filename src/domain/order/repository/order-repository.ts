import { Identity } from '../../identity/identity'
import { Order } from '../order'
import { OrderStatus } from '../order-status'

export interface OrderRepository {
    get: (id: Identity) => Promise<Order>
    save: (order: Order) => Promise<void>
    findByCustomerIdAndStatus: (customerId: Identity, status: OrderStatus) => Promise<Order | undefined>
    findByStoreId: (storeId: Identity) => Promise<Order[]>
}
