import { Request, Response } from 'express'
import ListStore from '../../../application/store/list/list-store'
import { ListStoreQuery } from '../../../application/store/list/list-store-query'
import FindOrderByCustomerId from '../../../application/order/find-by-customer-id/find-order-by-customer-id'
import { FindOrderByCustomerIdQuery } from '../../../application/order/find-by-customer-id/find-order-by-customer-id-query'
import JsonApiStoreTransformer from '../transformer/json-api-store-transformer'
import JsonApiOrderTransformer, { JsonApiOrder } from '../../order/transformer/json-api-order-transformer'

export default class ListStoreController {
    constructor(
        private readonly listStore: ListStore,
        private readonly findOrderByCustomerId: FindOrderByCustomerId,
        private readonly jsonApiStoreTransformer: JsonApiStoreTransformer,
        private readonly jsonApiOrderTransformer: JsonApiOrderTransformer
    ) { }

    handle = async (req: Request, res: Response): Promise<void> => {
        const customerId = await this.getCustomerId(req)

        const stores = await this.listStore.execute(new ListStoreQuery())
        const storesJsonApi = this.jsonApiStoreTransformer.transformArray(stores)

        let orderJsonApi: JsonApiOrder | null = null
        const orderDetail = await this.findOrderByCustomerId.execute(new FindOrderByCustomerIdQuery(customerId))
        if (orderDetail) {
            orderJsonApi = this.jsonApiOrderTransformer.transform(orderDetail)
        }

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
