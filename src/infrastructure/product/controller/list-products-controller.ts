import * as joi from 'joi'
import { Request, Response } from 'express'
import ListProducts from '../../../application/product/list/list-products'
import { ListProductsQuery } from '../../../application/product/list/list-products-query'
import FindStoreById from '../../../application/store/find-by-id/find-store-by-id'
import { FindStoreByIdQuery } from '../../../application/store/find-by-id/find-store-by-id-query'
import { Product } from '../../../domain/product/product'
import { InvalidJsonSchemaError } from '../../error/invalid-json-schema-error'

export default class ListProductsController {
    constructor(private readonly listProducts: ListProducts, private readonly findStoreById: FindStoreById) { }

    handle = async (req: Request, res: Response): Promise<void> => {
        const requestParams = this.ensureValidRequestParams(req)
        const store = await this.findStoreById.execute(new FindStoreByIdQuery(requestParams.storeId))
        const storeJsonApi = {
            id: store.id,
            attributes: {
                name: store.name
            }
        }

        const products = await this.listProducts.execute(new ListProductsQuery(requestParams.storeId))
        const productsJsonApi = products.map((product: Product) => {
            return {
                id: product.id,
                attributes: {
                    name: product.name
                }
            }
        })

        res.render('product/list', {
            store: storeJsonApi,
            products: productsJsonApi
        })
    }

    private ensureValidRequestParams(req: Request): any {
      const schema = joi.object({
        storeId: joi.string().uuid().required()
      })
      const validationResult = schema.validate(req.params)
  
      if (validationResult.error != null) {
        throw new InvalidJsonSchemaError(validationResult.error.message)
      }
  
      return validationResult.value
    }
}
