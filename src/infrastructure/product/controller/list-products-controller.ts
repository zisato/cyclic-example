import { Request, Response } from 'express'
import ListProducts from '../../../application/product/list/list-products'
import { ListProductsQuery } from '../../../application/product/list/list-products-query'
import { Product } from '../../../domain/product/product'
import FindStoreById from '../../../application/store/find-by-id/find-store-by-id'
import { FindStoreByIdQuery } from '../../../application/store/find-by-id/find-store-by-id-query'
import FindOrderByCustomerId from '../../../application/order/find-by-customer-id/find-order-by-customer-id'
import { FindOrderByCustomerIdCommand } from '../../../application/order/find-by-customer-id/find-order-by-customer-id-command'
import { JsonApiProductTransformer } from '../transformer/json-api-product-transformer'

export default class ListProductsController {
    constructor(private readonly listProducts: ListProducts, private readonly findStoreById: FindStoreById, private readonly findOrderByCustomerId: FindOrderByCustomerId) { }

    handle = async (req: Request, res: Response): Promise<void> => {
        const customerId = await this.getCustomerId(req)

        const store = await this.findStoreById.execute(new FindStoreByIdQuery(req.params.storeId))
        const storeJsonApi = {
            id: store.id.value,
            attributes: {
                name: store.name
            }
        }

        const products = await this.listProducts.execute(new ListProductsQuery(store.id.value))
        const productsJsonApi = products.map((product: Product) => {
            return JsonApiProductTransformer.transform(product)
        })

        const order = await this.findOrderByCustomerId.execute(new FindOrderByCustomerIdCommand(customerId))
        const orderJsonApi = {
            id: order.id.value,
            attributes: {
                items: order.items
            }
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
