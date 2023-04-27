import { Request, Response } from 'express'
import * as joi from 'joi'
import CreateCategory from '../../../../application/category/create/create-category'
import { CreateCategoryCommand } from '../../../../application/category/create/create-category-command'
import { InvalidJsonSchemaError } from '../../../error/invalid-json-schema-error'
import { UuidV1 } from '../../../identity/uuid-v1'

export default class CreateCategoryController {
  constructor(private readonly createCategory: CreateCategory) { }

  handle = async (req: Request, res: Response): Promise<void> => {
    if (req.method === 'POST') {
      req.body.id = UuidV1.create().value
      const requestBody = this.ensureValidRequestBody(req)

      const command = new CreateCategoryCommand(requestBody.id, requestBody.attributes.name)
      await this.createCategory.execute(command)

      return res.redirect('/admin/categories')
    }

    res.status(200).render('admin/category/create')
  }

  private ensureValidRequestBody(req: Request): any {
    const schema = joi.object({
      id: joi.string().uuid().required(),
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
