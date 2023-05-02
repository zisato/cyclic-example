import { Request } from 'express'
import { Form } from '../../form/form'
import joi, { ValidationError } from 'joi'

type AddItemFormData = {
    attributes: {
        product: {
            id: string
            quantity: number
        }
    }
}

export class AddItemForm implements Form<AddItemFormData> {
    private validationError: ValidationError | null = null
    private data: AddItemFormData | null = null

    async handleRequest(request: Request): Promise<void> {
        const validationResult = this.getValidationBodyResult(request.body)
        if (validationResult.error !== undefined) {
            this.validationError = validationResult.error

            return
        }

        this.data = validationResult.value
    }

    isValid(): boolean {
        return this.validationError === null
    }

    getData(): AddItemFormData {
        if (this.data === null) {
            throw new Error('Form not handled')
        }

        return this.data
    }

    getError(): ValidationError | null {
        return this.validationError
    }

    private getValidationBodyResult(data: any): joi.ValidationResult<AddItemFormData> {
        const schema = joi.object({
            attributes: joi.object({
                product: joi.object({
                    id: joi.string().required(),
                    quantity: joi.number().default(1)
                }).required()
            }).required(),
        })

        return schema.validate(data)
    }
}
