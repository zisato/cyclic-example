import { StoreRepository } from '../../../domain/store/repository/store-repository'
import { Store } from '../../../domain/store/store'
import { ListStoreQuery } from './list-store-query'

export default class ListStore {
    constructor(private readonly storeRepository: StoreRepository) { }

    async execute(_query: ListStoreQuery): Promise<Store[]> {
        return this.storeRepository.find()
    }
}
