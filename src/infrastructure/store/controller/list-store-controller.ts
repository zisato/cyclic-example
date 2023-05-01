import { Request, Response } from 'express'
import ListStore from '../../../application/store/list/list-store'
import { ListStoreQuery } from '../../../application/store/list/list-store-query'
import { Store } from '../../../domain/store/store'
import FindOrderByCustomerId from '../../../application/order/find-by-customer-id/find-order-by-customer-id'
import { FindOrderByCustomerIdCommand } from '../../../application/order/find-by-customer-id/find-order-by-customer-id-command'
import { JsonApiStoreTransformer } from '../transformer/json-api-store-transformer'
import { JsonApiOrderTransformer } from '../../order/transformer/json-api-order-transformer'

export default class ListStoreController {
    constructor(private readonly listStore: ListStore, private readonly findOrderByCustomerId: FindOrderByCustomerId) { }

    handle = async (req: Request, res: Response): Promise<void> => {
        const customerId = await this.getCustomerId(req)

        const stores = await this.listStore.execute(new ListStoreQuery())
        const storesJsonApi = stores.map((store: Store) => {
            return JsonApiStoreTransformer.transform(store)
        })

        const orderDetail = await this.findOrderByCustomerId.execute(new FindOrderByCustomerIdCommand(customerId))
        const orderJsonApi = JsonApiOrderTransformer.transform(orderDetail)

        res.status(200).render('store/list', {
            stores: storesJsonApi,
            order: orderJsonApi
        })
    }

    private async getCustomerId(req: Request): Promise<string> {
        if (req.user === undefined || !('id' in req.user)) {
            throw new Error('Not authenticated customer')
        }

        return req.user.id as string
    }
}
