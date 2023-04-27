import * as joi from 'joi'
import { Request, Response } from 'express'
import CreateProduct from '../../../../application/product/create/create-product'
import { CreateProductCommand } from '../../../../application/product/create/create-product-command'
import { InvalidJsonSchemaError } from '../../../error/invalid-json-schema-error'
import FindStoreBySellerId from '../../../../application/store/find-by-seller-id/find-store-by-seller-id'
import { FindStoreBySellerIdQuery } from '../../../../application/store/find-by-seller-id/find-store-by-seller-id-query'
import { UuidV1 } from '../../../identity/uuid-v1'
import ListCategories from '../../../../application/category/list/list-categories'
import { ListCategoriesQuery } from '../../../../application/category/list/list-categories-query'
import { Category } from '../../../../domain/category/category'
import { Identity } from '../../../../domain/identity/identity'

export default class CreateProductController {
  constructor(
    private readonly findStoreBySellerId: FindStoreBySellerId,
    private readonly createProduct: CreateProduct,
    private readonly listCategories: ListCategories
  ) { }

  handle = async (req: Request, res: Response): Promise<void> => {
    const sellerId = this.getSellerId(req)

    if (req.method === 'POST') {
      const storeId = await this.getStoreId(sellerId)
      req.body.id = UuidV1.create().value
      const requestBody = this.ensureValidRequestBody(req)

      const command = new CreateProductCommand(
        requestBody.id,
        requestBody.attributes.name,
        requestBody.relationships.category.id,
        storeId.value
      )
      await this.createProduct.execute(command)

      return res.redirect('/admin/products')
    }

    const categories = await this.listCategories.execute(new ListCategoriesQuery())
    const categoriesJsonApi = categories.map((category: Category) => {
      return {
        id: category.id.value,
        attributes: {
          name: category.name
        }
      }
    })

    res.status(200).render('admin/product/create', {
      categories: categoriesJsonApi
    })
  }

  private ensureValidRequestBody(req: Request): any {
    const schema = joi.object({
      id: joi.string().uuid().required(),
      attributes: joi.object({
        name: joi.string().required()
      }).required(),
      relationships: joi.object({
        category: joi.object({
          id: joi.string().required()
        }).required(),
      }).required()
    })
    const validationResult = schema.validate(req.body)

    if (validationResult.error != null) {
      throw new InvalidJsonSchemaError(validationResult.error.message)
    }

    return validationResult.value
  }

  private getSellerId(req: Request): string {
    if (req.user === undefined || !('id' in req.user)) {
      throw new Error('Not authenticated customer')
    }

    return req.user.id as string
  }

  private async getStoreId(sellerId: string): Promise<Identity> {
    const store = await this.findStoreBySellerId.execute(new FindStoreBySellerIdQuery(sellerId))

    return store.id
  }
}
