import { Request, Response } from 'express'
import ListSellers from '../../../application/seller/list/list-sellers'
import { ListSellersQuery } from '../../../application/seller/list/list-sellers-query'
import { Seller } from '../../../domain/seller/seller'
import JsonApiSellerTransformer from '../transformer/json-api-seller-transformer'

export default class ListSellersController {
    constructor(
        private readonly listSellers: ListSellers,
        private readonly jsonApiSellerTransformer: JsonApiSellerTransformer
    ) { }

    handle = async (_req: Request, res: Response): Promise<void> => {
        const query = new ListSellersQuery()

        const sellers = await this.listSellers.execute(query)
        const sellersJsonApi = sellers.map((seller: Seller) => {
            return this.jsonApiSellerTransformer.transform(seller)
        })

        res.json(sellersJsonApi)
    }
}
