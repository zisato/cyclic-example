import { Request, Response } from 'express'
import ListProducts from '../../../application/product/list/list-products'
import { ListProductsQuery } from '../../../application/product/list/list-products-query'
import { Product } from '../../../domain/product/product'
import FindStoreById from '../../../application/store/find-by-id/find-store-by-id'
import { FindStoreByIdQuery } from '../../../application/store/find-by-id/find-store-by-id-query'
import FindOrderByCustomerId from '../../../application/order/find-by-customer-id/find-order-by-customer-id'
import { FindOrderByCustomerIdQuery } from '../../../application/order/find-by-customer-id/find-order-by-customer-id-query'
import { JsonApiProductTransformer } from '../transformer/json-api-product-transformer'
import { JsonApiStoreTransformer } from '../../store/transformer/json-api-store-transformer'
import { JsonApiOrderTransformer } from '../../order/transformer/json-api-order-transformer'

export default class ListProductsController {
    constructor(private readonly listProducts: ListProducts, private readonly findStoreById: FindStoreById, private readonly findOrderByCustomerId: FindOrderByCustomerId) { }

    handle = async (req: Request, res: Response): Promise<void> => {
        const customerId = await this.getCustomerId(req)

        const store = await this.findStoreById.execute(new FindStoreByIdQuery(req.params.storeId))
        const storeJsonApi = JsonApiStoreTransformer.transform(store)

        const products = await this.listProducts.execute(new ListProductsQuery(store.id.value))
        const productsJsonApi = products.map((product: Product) => {
            return JsonApiProductTransformer.transform(product)
        })

        let orderJsonApi = null
        const orderDetail = await this.findOrderByCustomerId.execute(new FindOrderByCustomerIdQuery(customerId))
        if (orderDetail) {
            orderJsonApi = JsonApiOrderTransformer.transform(orderDetail)
        }

        res.status(200).render('product/list', {
            store: storeJsonApi,
            products: productsJsonApi,
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
