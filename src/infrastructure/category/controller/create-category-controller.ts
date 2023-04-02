import { Request, Response } from 'express'
import * as joi from 'joi'
import CreateCategory from '../../../application/category/create/create-category'
import { CreateCategoryCommand } from '../../../application/category/create/create-category-command'
import { InvalidJsonSchemaError } from '../../error/invalid-json-schema-error'

export default class CreateCategoryController {
  constructor(private readonly createCategory: CreateCategory) { }

  handle = async (req: Request, res: Response): Promise<void> => {
    const requestBody = this.ensureValidRequestBody(req)

    const command = new CreateCategoryCommand(requestBody.data.id, requestBody.data.attributes.name)
    await this.createCategory.execute(command)

    res.status(201).send()
  }

  private ensureValidRequestBody(req: Request): any {
    const schema = joi.object({
      data: joi.object({
        id: joi.string().uuid().required(),
        attributes: joi.object({
          name: joi.string().required()
        }).required(),
      }).required()
    })
    const validationResult = schema.validate(req.body)

    if (validationResult.error != null) {
      throw new InvalidJsonSchemaError(validationResult.error.message)
    }

    return validationResult.value
  }
}
