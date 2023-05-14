import { Request, Response } from 'express'
import DeleteCategory from '../../../../application/category/delete/delete-category'
import { DeleteCategoryCommand } from '../../../../application/category/delete/delete-category-command'

export default class DeleteCategoryController {
  constructor(private readonly deleteCategory: DeleteCategory) { }

  handle = async (req: Request, res: Response): Promise<void> => {
    const command = new DeleteCategoryCommand(req.params.categoryId)

    await this.deleteCategory.execute(command)

    return res.redirect('/admin/categories')
  }
}
