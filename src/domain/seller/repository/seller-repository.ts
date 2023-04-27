import { Identity } from '../../identity/identity'
import { Seller } from '../seller'

export interface SellerRepository {
    exists: (id: Identity) => Promise<boolean>
    save: (seller: Seller) => Promise<void>
    find: () => Promise<Seller[]>
}
