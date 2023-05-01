import { Request, Response } from 'express'
import ListProducts from '../../../../application/product/list/list-products'
import { ListProductsQuery } from '../../../../application/product/list/list-products-query'
import FindStoreBySellerId from '../../../../application/store/find-by-seller-id/find-store-by-seller-id'
import { FindStoreBySellerIdQuery } from '../../../../application/store/find-by-seller-id/find-store-by-seller-id-query'
import { Product } from '../../../../domain/product/product'
import { Store } from '../../../../domain/store/store'
import { JsonApiProductTransformer } from '../../transformer/json-api-product-transformer'

export default class ListProductsController {
    constructor(private readonly listProducts: ListProducts, private readonly findStoreBySellerId: FindStoreBySellerId) { }

    handle = async (req: Request, res: Response): Promise<void> => {
        const sellerId = this.getSellerId(req)
        const store = await this.getStore(sellerId)
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

        res.status(200).render('admin/product/list', {
            store: storeJsonApi,
            products: productsJsonApi
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
