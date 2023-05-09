import * as joi from 'joi'
import { UploadedFile } from 'express-fileupload'
import { Product } from '../../../domain/product/product'
import { AbstractForm } from '../../form/abstract-form'

type UpdateProductFormData = {
    attributes: {
        name: string
        image?: UploadedFile
    }
}

export class UpdateProductForm extends AbstractForm<UpdateProductFormData> {
    constructor(product: Product) {
        super()
        this.setData({
            attributes: {
                name: product.name,
                image: undefined
            }
        })
    }

    getValidationBodySchema(): joi.ObjectSchema<UpdateProductFormData> {
        return joi.object({
            attributes: joi.object({
                name: joi.string()
            })
        })
    }
}
