import { Identity } from '../../identity/identity'
import { Order } from '../order'

export interface OrderRepository {
    get: (id: Identity) => Promise<Order>
    save: (order: Order) => Promise<void>
    findByCustomerId: (customerId: Identity) => Promise<Order | undefined>
}
