import * as joi from 'joi'
import { AbstractForm } from '../../form/abstract-form'
import { UploadedFile } from 'express-fileupload'

type CreateProductFormData = {
    attributes: {
        name: string
        image?: UploadedFile
    },
    relationships: {
        category: {
            id: string
        }
    }
}

export class CreateProductForm extends AbstractForm<CreateProductFormData> {
    getValidationBodySchema(): joi.ObjectSchema<CreateProductFormData> {
        return joi.object({
            attributes: joi.object({
                name: joi.string().required()
            }).required(),
            relationships: joi.object({
                category: joi.object({
                    id: joi.string().required()
                }).required(),
            }).required()
        })
    }
}
