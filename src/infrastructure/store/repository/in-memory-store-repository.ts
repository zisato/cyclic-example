import { Store } from '../../../domain/store/store'
import { StoreRepository } from '../../../domain/store/repository/store-repository'

export default class InMemoryStoreRepository implements StoreRepository {
    private readonly data: Store[] = []

    async exists(id: string): Promise<boolean> {
        return this.data.some((store: Store): boolean => {
            return store.id === id
        })
    }

    async save(store: Store): Promise<void> {
        const existingStoreIndex = this.data.findIndex((data: Store) => {
            return data.id === store.id
        })

        if (existingStoreIndex >= 0) {
            this.data[existingStoreIndex] = store
        } else {
            this.data.push(store)
        }
    }
}
