import joi from 'joi'
import { AbstractForm } from '../../form/abstract-form'

type AddItemFormData = {
    attributes: {
        product: {
            id: string
            quantity: number
        }
    }
}

export class AddItemForm extends AbstractForm<AddItemFormData> {
    getValidationBodySchema(): joi.ObjectSchema<AddItemFormData> {
        return joi.object({
            attributes: joi.object({
                product: joi.object({
                    id: joi.string().required(),
                    quantity: joi.number().default(1)
                }).required()
            }).required(),
        })
    }
}
