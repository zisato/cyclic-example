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
import sharp from 'sharp'

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
        const imageFilename = await this.getImageFilename(updateProductFormData.attributes.image)

        await this.updateProduct.execute(new UpdateProductCommand(product.id.value, updateProductFormData.attributes.name, imageFilename))
      }

      return res.redirect(`/admin/products/${product.id.value}/update`)
    }

    const productJsonApi = await this.jsonApiProductDetailTransformer.transform(product)

    res.status(200).render('admin/product/update', {
      product: productJsonApi
    })
  }

  private async getProduct(productId: string): Promise<Product> {
    return await this.findProductById.execute(new FindProductByIdQuery(productId))
  }

  private async getImageFilename(uploadedFile?: UploadedFile): Promise<string | undefined> {
    if (!uploadedFile) {
      return
    }

    const resizedImageData = await sharp(uploadedFile.data).resize(450, 200).toBuffer()

    const file = new File({
      name: uploadedFile.name,
      mimeType: uploadedFile.mimetype,
      size: resizedImageData.length,
      data: resizedImageData
    })

    return await this.fileStorageService.put(file)    
  }
}
