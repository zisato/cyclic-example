import { Order } from '../order'

export interface OrderRepository {
    get: (id: string) => Promise<Order>
    save: (order: Order) => Promise<void>
    findByCustomerId: (customerId: string) => Promise<Order | undefined>
}
