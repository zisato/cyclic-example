import { SellerRepository } from '../../../domain/seller/repository/seller-repository'
import { Seller } from '../../../domain/seller/seller'
import { ListSellersQuery } from './list-sellers-query'

export default class ListSellers {
    constructor(private readonly sellerRepository: SellerRepository) { }

    async execute(_query: ListSellersQuery): Promise<Seller[]> {
        return this.sellerRepository.find()
    }
}
