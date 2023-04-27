import { Seller } from '../seller'

export interface SellerRepository {
    exists: (id: string) => Promise<boolean>
    save: (seller: Seller) => Promise<void>
    find: () => Promise<Seller[]>
}
