import { Request, Response } from 'express'
import CreateProduct from '../../../../application/product/create/create-product'
import { CreateProductCommand } from '../../../../application/product/create/create-product-command'
import FindStoreBySellerId from '../../../../application/store/find-by-seller-id/find-store-by-seller-id'
import { FindStoreBySellerIdQuery } from '../../../../application/store/find-by-seller-id/find-store-by-seller-id-query'
import { UuidV1 } from '../../../identity/uuid-v1'
import ListCategories from '../../../../application/category/list/list-categories'
import { ListCategoriesQuery } from '../../../../application/category/list/list-categories-query'
import { Identity } from '../../../../domain/identity/identity'
import { CreateProductForm } from '../../form/create-product-form'
import JsonApiCategoryTransformer from '../../../category/transformer/json-api-category-transformer'
import { UploadedFile } from 'express-fileupload'
import { FileStorageService } from '../../../file-storage/file-storage-service'
import { File } from '../../../file-storage/file'

export default class CreateProductController {
  constructor(
    private readonly findStoreBySellerId: FindStoreBySellerId,
    private readonly createProduct: CreateProduct,
    private readonly listCategories: ListCategories,
    private readonly fileStorageService: FileStorageService,
    private readonly jsonApiCategoryTransformer: JsonApiCategoryTransformer
  ) { }

  handle = async (req: Request, res: Response): Promise<void> => {
    if (req.method === 'POST') {
      const createProductForm = new CreateProductForm()

      await createProductForm.handleRequest(req)

      if (createProductForm.isValid()) {
        const sellerId = this.getSellerId(req)
        const storeId = await this.getStoreId(sellerId)
        const createProductFormData = createProductForm.getData()
        const imageFilename = await this.getImageFilename(createProductFormData.attributes.image)

        const command = new CreateProductCommand(
          UuidV1.create().value,
          createProductFormData.attributes.name,
          createProductFormData.relationships.category.id,
          storeId.value,
          imageFilename
        )
  
        await this.createProduct.execute(command)
      }

      return res.redirect('/admin/products')
    }

    const categories = await this.listCategories.execute(new ListCategoriesQuery())
    const categoriesJsonApi = this.jsonApiCategoryTransformer.transformArray(categories)

    res.status(200).render('admin/product/create', {
      categories: categoriesJsonApi
    })
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

  private async getImageFilename(uploadedFile?: UploadedFile): Promise<string | undefined> {
    if (!uploadedFile) {
      return
    }

    const file = new File({
      name: uploadedFile.name,
      mimeType: uploadedFile.mimetype,
      size: uploadedFile.size,
      data: uploadedFile.data
    })

    return await this.fileStorageService.put(file)    
  }
}
