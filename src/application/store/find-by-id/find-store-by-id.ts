import { FindStoreByIdQuery } from './find-store-by-id-query'
import { StoreRepository } from '../../../domain/store/repository/store-repository'
import { Store } from '../../../domain/store/store'

export default class FindStoreById {
    constructor(private readonly storeRepository: StoreRepository) { }

    async execute(query: FindStoreByIdQuery): Promise<Store> {
        return this.storeRepository.get(query.id)
    }
}
