import { Request, Response } from 'express'
import UpdateProduct from '../../../../application/product/update/update-product'
import { UpdateProductCommand } from '../../../../application/product/update/update-product-command'
import { Product } from '../../../../domain/product/product'
import { FindProductByIdQuery } from '../../../../application/product/find-by-id/find-product-by-id-query'
import FindProductById from '../../../../application/product/find-by-id/find-product-by-id'
import { UpdateProductForm } from '../../form/update-product-form'
import JsonApiProductDetailTransformer from '../../transformer/json-api-product-detail-transformer'
import { FileStorageService } from '../../../file-storage/file-storage-service'
import { UploadedFile } from 'express-fileupload'
import { File } from '../../../file-storage/file'

export default class UpdateProductController {
  constructor(
    private readonly findProductById: FindProductById,
    private readonly updateProduct: UpdateProduct,
    private readonly fileStorageService: FileStorageService,
    private readonly jsonApiProductDetailTransformer: JsonApiProductDetailTransformer
  ) { }

  handle = async (req: Request, res: Response): Promise<void> => {
    const product = await this.getProduct(req.params.productId)

    if (req.method === 'POST') {
      const updateProductForm = new UpdateProductForm(product)

      await updateProductForm.handleRequest(req)

      if (updateProductForm.isValid()) {
        const updateProductFormData = updateProductForm.getData()
        const imageFilename = this.getImageFilename(updateProductFormData.attributes.image)

        await this.updateProduct.execute(new UpdateProductCommand(product.id.value, updateProductFormData.attributes.name, imageFilename))
      }

      return res.redirect(`/admin/products/${product.id.value}/update`)
    }

    const productJsonApi = this.jsonApiProductDetailTransformer.transform(product)

    res.status(200).render('admin/product/update', {
      product: productJsonApi
    })
  }

  private async getProduct(productId: string): Promise<Product> {
    return await this.findProductById.execute(new FindProductByIdQuery(productId))
  }

  private getImageFilename(uploadedFile?: UploadedFile): string | undefined {
    if (!uploadedFile) {
      return
    }

    const file = new File({
      name: uploadedFile.name,
      mimeType: uploadedFile.mimetype,
      size: uploadedFile.size,
      data: uploadedFile.data
    })

    return this.fileStorageService.put(file)    
  }
}
