import { Request, Response } from 'express'
import CreateCategory from '../../../../application/category/create/create-category'
import { CreateCategoryCommand } from '../../../../application/category/create/create-category-command'
import { UuidV1 } from '../../../identity/uuid-v1'
import { CreateCategoryForm } from '../../form/create-category-form'

export default class CreateCategoryController {
  constructor(private readonly createCategory: CreateCategory) { }

  handle = async (req: Request, res: Response): Promise<void> => {
    if (req.method === 'POST') {
      const createCategoryForm = new CreateCategoryForm()
      
      await createCategoryForm.handleRequest(req)

      if (createCategoryForm.isValid()) {
        const createCategoryFormData = createCategoryForm.getData()
        const command = new CreateCategoryCommand(UuidV1.create().value, createCategoryFormData.attributes.name)

        await this.createCategory.execute(command)
      }

      return res.redirect('/admin/categories')
    }

    res.status(200).render('admin/category/create')
  }
}
