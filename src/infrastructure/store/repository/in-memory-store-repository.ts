import { Store } from '../../../domain/store/store'
import { StoreRepository } from '../../../domain/store/repository/store-repository'
import { ModelNotFoundError } from '../../../domain/error/model-not-found-error'
import { Identity } from '../../../domain/identity/identity'

export default class InMemoryStoreRepository implements StoreRepository {
    private readonly data: Store[] = []

    async get(id: Identity): Promise<Store> {
        const existingStoreIndex = this.data.findIndex((store: Store) => {
            return store.id.equals(id)
        })

        if (existingStoreIndex === -1) {
            throw new ModelNotFoundError(`Store with id ${id.value} not found`)
        }

        return this.data[existingStoreIndex]
    }

    async exists(id: Identity): Promise<boolean> {
        return this.data.some((store: Store): boolean => {
            return store.id.equals(id)
        })
    }

    async save(store: Store): Promise<void> {
        const existingStoreIndex = this.data.findIndex((data: Store) => {
            return data.id.equals(store.id)
        })

        if (existingStoreIndex >= 0) {
            this.data[existingStoreIndex] = store
        } else {
            this.data.push(store)
        }
    }

    async findBySellerId(sellerId: Identity): Promise<Store> {
        const existingStoreIndex = this.data.findIndex((store: Store) => {
            return store.sellerId.equals(sellerId)
        })

        if (existingStoreIndex === -1) {
            throw new ModelNotFoundError(`Store with sellerId ${sellerId.value} not found`)
        }

        return this.data[existingStoreIndex]
    }

    async find(): Promise<Store[]> {
        return this.data
    }
}
