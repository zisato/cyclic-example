import { Request, Response } from 'express'
import UpdateProduct from '../../../../application/product/update/update-product'
import { UpdateProductCommand } from '../../../../application/product/update/update-product-command'
import { Product } from '../../../../domain/product/product'
import { FindProductByIdQuery } from '../../../../application/product/find-by-id/find-product-by-id-query'
import FindProductById from '../../../../application/product/find-by-id/find-product-by-id'
import { UpdateProductForm } from '../../form/update-product-form'
import { JsonApiProductTransformer } from '../../transformer/json-api-product-transformer'

export default class UpdateProductController {
  constructor(private readonly findProductById: FindProductById, private readonly updateProduct: UpdateProduct) { }

  handle = async (req: Request, res: Response): Promise<void> => {
    const product = await this.getProduct(req.params.productId)

    if (req.method === 'POST') {
      const updateProductForm = new UpdateProductForm(product)

      await updateProductForm.handleRequest(req)

      if (updateProductForm.isValid()) {
        const updateProductFormData = updateProductForm.getData()

        await this.updateProduct.execute(new UpdateProductCommand(product.id.value, updateProductFormData.attributes.name, updateProductFormData.attributes.image))
      }

      return res.redirect(`/admin/products/${product.id.value}/update`)
    }

    const productJsonApi = JsonApiProductTransformer.transform(product)

    res.status(200).render('admin/product/update', {
      product: productJsonApi
    })
  }

  private async getProduct(productId: string): Promise<Product> {
    return await this.findProductById.execute(new FindProductByIdQuery(productId))
  }
}
