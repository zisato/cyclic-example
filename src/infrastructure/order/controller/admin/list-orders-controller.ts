import { Request, Response } from 'express'
import FindStoreBySellerId from '../../../../application/store/find-by-seller-id/find-store-by-seller-id'
import JsonApiStoreTransformer from '../../../store/transformer/json-api-store-transformer'
import { Store } from '../../../../domain/store/store'
import { FindStoreBySellerIdQuery } from '../../../../application/store/find-by-seller-id/find-store-by-seller-id-query'
import FindOrdersByStoreId from '../../../../application/order/find-by-store-id/find-orders-by-store-id'
import { FindOrdersByStoreIdQuery } from '../../../../application/order/find-by-store-id/find-orders-by-store-id-query'
import JsonApiOrderDetailTransformer from '../../transformer/json-api-order-detail-transformer'

export default class ListOrdersController {
    constructor(
        private readonly findOrdersByStoreId: FindOrdersByStoreId,
        private readonly findStoreBySellerId: FindStoreBySellerId,
        private readonly jsonApiStoreTransformer: JsonApiStoreTransformer,
        private readonly jsonApiOrderDetailTransformer: JsonApiOrderDetailTransformer
    ) { }

    handle = async (req: Request, res: Response): Promise<void> => {
        const sellerId = this.getSellerId(req)
        const store = await this.getStore(sellerId)
        const storeJsonApi = this.jsonApiStoreTransformer.transform(store)
        const orders = await this.findOrdersByStoreId.execute(new FindOrdersByStoreIdQuery(store.id.value))
        const ordersJsonApi = this.jsonApiOrderDetailTransformer.transformArray(orders)

        res.status(200).render('admin/order/list', {
            store: storeJsonApi,
            orders: ordersJsonApi
        })
    }

    private getSellerId(req: Request): string {
        if (req.user === undefined || !('id' in req.user)) {
            throw new Error('Not authenticated customer')
        }

        return req.user.id as string
    }

    private async getStore(sellerId: string): Promise<Store> {
        return await this.findStoreBySellerId.execute(new FindStoreBySellerIdQuery(sellerId))
    }
}
