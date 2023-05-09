import * as joi from 'joi'
import { AbstractForm } from '../../form/abstract-form'

type CreateCategoryFormData = {
    attributes: {
        name: string
    }
}

export class CreateCategoryForm extends AbstractForm<CreateCategoryFormData> {
    getValidationBodySchema(): joi.ObjectSchema<CreateCategoryFormData> {
        return joi.object({
            attributes: joi.object({
                name: joi.string().required()
            }).required(),
        })
    }
}
