import * as joi from 'joi'
import { Request } from 'express'
import { FileArray, UploadedFile } from 'express-fileupload'
import { File } from '../../file-storage/file'
import { ValidationError } from 'joi'

type CreateProductFormData = {
    attributes: {
        name: string
        image?: File
    },
    relationships: {
        category: {
            id: string
        }
    }
}

export class CreateProductForm {
    private validationError?: ValidationError = undefined
    private data: CreateProductFormData | null = null

    handleRequest(request: Request): void {
        const validationResult = this.getValidationBodyResult(request.body)
        if (validationResult.error !== undefined) {
            this.validationError = validationResult.error

            return
        }

        this.data = validationResult.value

        if (request.files?.attributes) {
            this.data.attributes.image = this.handleImageFile(request.files.attributes as unknown as FileArray)
        }
    }

    isValid(): boolean {
        return this.validationError === undefined
    }

    getData(): CreateProductFormData {
        if (this.data === null) {
            throw new Error('Form not handled')
        }

        return this.data
    }

    private handleImageFile(fileArray: FileArray): File {
        const imageUploadedFile = fileArray.image as UploadedFile | UploadedFile[]
        const file = Array.isArray(imageUploadedFile) ? imageUploadedFile[0] : imageUploadedFile

        return {
            mimeType: file.mimetype,
            name: file.name,
            data: file.data,
            size: file.size
        }
    }

    private getValidationBodyResult(data: any): joi.ValidationResult<CreateProductFormData> {
        const schema = joi.object({
            attributes: joi.object({
                name: joi.string().required()
            }).required(),
            relationships: joi.object({
                category: joi.object({
                    id: joi.string().required()
                }).required(),
            }).required()
        })

        return schema.validate(data)
    }
}
