import * as joi from 'joi'
import { Request, Response } from 'express'
import CreateProduct from '../../../application/product/create/create-product'
import { CreateProductCommand } from '../../../application/product/create/create-product-command'
import { InvalidJsonSchemaError } from '../../error/invalid-json-schema-error'
import { AuthRequest } from '../../express/auth-request'
import FindStoreBySellerId from '../../../application/store/find-by-seller-id/find-store-by-seller-id'
import { FindStoreBySellerIdQuery } from '../../../application/store/find-by-seller-id/find-store-by-seller-id-query'

export default class CreateProductController {
  constructor(private readonly findStoreByUser: FindStoreBySellerId, private readonly createProduct: CreateProduct) { }

  handle = async (req: AuthRequest, res: Response): Promise<void> => {
    const requestBody = this.ensureValidRequestBody(req)
    const storeId = await this.getStoreId(req)

    const command = new CreateProductCommand(
      requestBody.data.id,
      requestBody.data.attributes.name,
      requestBody.data.relationships.category.id,
      storeId
    )
    await this.createProduct.execute(command)

    res.status(201).send()
  }

  private ensureValidRequestBody(req: Request): any {
    const schema = joi.object({
      data: joi.object({
        id: joi.string().uuid().required(),
        attributes: joi.object({
          name: joi.string().required()
        }).required(),
        relationships: joi.object({
          category: joi.object({
            id: joi.string().required()
          }).required(),
        }).required(),
      }).required()
    })
    const validationResult = schema.validate(req.body)

    if (validationResult.error != null) {
      throw new InvalidJsonSchemaError(validationResult.error.message)
    }

    return validationResult.value
  }

  private async getStoreId(req: AuthRequest): Promise<string> {
    if (req.user === undefined) {
      throw new Error('Not authenticated user')
    }

    const store = await this.findStoreByUser.execute(new FindStoreBySellerIdQuery(req.user.id))

    return store.id
  }
}
