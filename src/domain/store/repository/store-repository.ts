import { Store } from "../store"

export interface StoreRepository {
    get(id: string): Promise<Store>
    exists: (id: string) => Promise<boolean>
    save: (store: Store) => Promise<void>
}