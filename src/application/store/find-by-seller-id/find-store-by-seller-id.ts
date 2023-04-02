import { FindStoreBySellerIdQuery } from './find-store-by-seller-id-query'
import { StoreRepository } from '../../../domain/store/repository/store-repository'
import { Store } from '../../../domain/store/store'

export default class FindStoreBySellerId {
    constructor(private readonly storeRepository: StoreRepository) { }

    async execute(query: FindStoreBySellerIdQuery): Promise<Store> {
        return this.storeRepository.findBySellerId(query.sellerId)
    }
}
