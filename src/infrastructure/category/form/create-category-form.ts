import * as joi from 'joi'
import { Request } from 'express'
import { ValidationError } from 'joi'
import { Form } from '../../form/form'

type CreateCategoryFormData = {
    attributes: {
        name: string
    }
}

export class CreateCategoryForm implements Form<CreateCategoryFormData> {
    private validationError: ValidationError | null = null
    private data: CreateCategoryFormData | null = null

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

    getData(): CreateCategoryFormData {
        if (this.data === null) {
            throw new Error('Form not handled')
        }

        return this.data
    }

    getError(): ValidationError | null {
        return this.validationError
    }

    private getValidationBodyResult(data: any): joi.ValidationResult<CreateCategoryFormData> {
        const schema = joi.object({
            attributes: joi.object({
                name: joi.string().required()
            }).required(),
        })

        return schema.validate(data)
    }
}
