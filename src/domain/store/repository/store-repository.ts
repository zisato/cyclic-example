import { Identity } from '../../identity/identity'
import { Store } from '../store'

export interface StoreRepository {
    get: (id: Identity) => Promise<Store>
    exists: (id: Identity) => Promise<boolean>
    save: (store: Store) => Promise<void>
    findBySellerId: (sellerId: Identity) => Promise<Store>
    find: () => Promise<Store[]>
}
