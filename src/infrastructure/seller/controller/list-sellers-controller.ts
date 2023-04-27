import { Request, Response } from 'express'
import ListSellers from '../../../application/seller/list/list-sellers'
import { ListSellersQuery } from '../../../application/seller/list/list-sellers-query'
import { Seller } from '../../../domain/seller/seller'

export default class ListSellersController {
    constructor(private readonly listSellers: ListSellers) { }

    handle = async (_req: Request, res: Response): Promise<void> => {
        const query = new ListSellersQuery()

        const stores = await this.listSellers.execute(query)
        const storesJsonApi = stores.map((seller: Seller) => {
            return {
                id: seller.id.value,
                attributes: {
                    name: seller.name
                }
            }
        })

        res.json(storesJsonApi)
    }
}
