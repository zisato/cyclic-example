import { Store } from "../store"

export interface StoreRepository {
    exists: (id: string) => Promise<boolean>
    save: (store: Store) => Promise<void>
}