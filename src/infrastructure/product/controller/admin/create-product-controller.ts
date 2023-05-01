import { Request, Response } from 'express'
import CreateProduct from '../../../../application/product/create/create-product'
import { CreateProductCommand } from '../../../../application/product/create/create-product-command'
import FindStoreBySellerId from '../../../../application/store/find-by-seller-id/find-store-by-seller-id'
import { FindStoreBySellerIdQuery } from '../../../../application/store/find-by-seller-id/find-store-by-seller-id-query'
import { UuidV1 } from '../../../identity/uuid-v1'
import ListCategories from '../../../../application/category/list/list-categories'
import { ListCategoriesQuery } from '../../../../application/category/list/list-categories-query'
import { Category } from '../../../../domain/category/category'
import { Identity } from '../../../../domain/identity/identity'
import { CreateProductForm } from '../../form/create-product-form'
import { Image } from '../../../../domain/product/image'
import { File } from '../../../file-storage/file'

export default class CreateProductController {
  constructor(
    private readonly findStoreBySellerId: FindStoreBySellerId,
    private readonly createProduct: CreateProduct,
    private readonly listCategories: ListCategories,
  ) { }

  handle = async (req: Request, res: Response): Promise<void> => {
    if (req.method === 'POST') {
      const createProductForm = new CreateProductForm()
      createProductForm.handleRequest(req)

      if (createProductForm.isValid()) {
        const sellerId = this.getSellerId(req)
        const storeId = await this.getStoreId(sellerId)
        const createProductFormData = createProductForm.getData()
        const image = this.getImage(createProductFormData.attributes.image)
        const command = new CreateProductCommand(
          UuidV1.create().value,
          createProductFormData.attributes.name,
          createProductFormData.relationships.category.id,
          storeId.value,
          image
        )
  
        await this.createProduct.execute(command)
      }

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

  private getImage(imageFile?: File): Image | undefined {
    let image: Image | undefined = undefined
    if (imageFile) {
      image = new Image({ name: imageFile.name, mimeType: imageFile.mimeType, size: imageFile.size, data: imageFile.data })
    }

    return image
  }
}
