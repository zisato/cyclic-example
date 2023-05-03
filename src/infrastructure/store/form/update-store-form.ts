import * as joi from 'joi'
import { Request } from 'express'
import { Form } from '../../form/form'
import { ValidationError } from 'joi'
import { Store } from '../../../domain/store/store'

type UpdateStoreFormData = {
    attributes: {
        name: string
    }
}

export class UpdateStoreForm implements Form<UpdateStoreFormData> {
    private validationError: ValidationError | null = null
    private data: UpdateStoreFormData

    constructor(store: Store) {
        this.data = {
            attributes: {
                name: store.name
            }
        }
    }

    async handleRequest(request: Request): Promise<void> {
        const validationResult = this.getValidationBodyResult(request)
        if (validationResult.error !== undefined) {
            this.validationError = validationResult.error

            return
        }

        this.data = {
            ...this.data,
            ...validationResult.value,
        }
    }

    isValid(): boolean {
        return this.validationError === null
    }

    getData(): UpdateStoreFormData {
        return this.data
    }

    getError(): ValidationError | null {
        return this.validationError
    }

    private getValidationBodyResult(req: Request): joi.ValidationResult<UpdateStoreFormData> {
        const schema = joi.object({
            attributes: joi.object({
                name: joi.string()
            })
        })

        return schema.validate(req.body)
    }
}
