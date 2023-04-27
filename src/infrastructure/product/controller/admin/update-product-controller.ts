import * as joi from 'joi'
import { Request, Response } from 'express'
import UpdateProduct from '../../../../application/product/update/update-product'
import { UpdateProductCommand } from '../../../../application/product/update/update-product-command'
import { Product } from '../../../../domain/product/product'
import { FindProductByIdQuery } from '../../../../application/product/find-by-id/find-product-by-id-query'
import FindProductById from '../../../../application/product/find-by-id/find-product-by-id'
import { InvalidJsonSchemaError } from '../../../error/invalid-json-schema-error'

export default class UpdateProductController {
  constructor(private readonly findProductById: FindProductById, private readonly updateProduct: UpdateProduct) { }

  handle = async (req: Request, res: Response): Promise<void> => {
    const product = await this.getProduct(req.params.productId)

    if (req.method === 'POST') {
      const requestBody = this.ensureValidRequestBody(req)
      await this.updateProduct.execute(new UpdateProductCommand(product.id.value, requestBody.attributes.name))

      return res.redirect('/admin/products/update')
    }

    const productJsonApi = {
      id: product.id.value,
      attributes: {
        name: product.name
      }
    }

    res.status(200).render('admin/product/update', {
      product: productJsonApi
    })
  }

  private async getProduct(productId: string): Promise<Product> {
    return await this.findProductById.execute(new FindProductByIdQuery(productId))
  }

  private ensureValidRequestBody(req: Request): any {
    const schema = joi.object({
      attributes: joi.object({
        name: joi.string().required()
      }).required()
    })
    const validationResult = schema.validate(req.body)

    if (validationResult.error != null) {
      throw new InvalidJsonSchemaError(validationResult.error.message)
    }

    return validationResult.value
  }
}
