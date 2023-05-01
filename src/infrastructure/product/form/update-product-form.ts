import * as joi from 'joi'
import { Request } from 'express'
import { FileArray, UploadedFile } from 'express-fileupload'
import { File } from '../../file-storage/file'
import { ValidationError } from 'joi'
import sharp from 'sharp'
import { Product } from '../../../domain/product/product'

type UpdateProductFormData = {
    attributes: {
        name: string
        image: File | null
    }
}

export class UpdateProductForm {
    private validationError: ValidationError | null = null
    private data: UpdateProductFormData

    constructor(product: Product) {
        this.data = {
            attributes: {
                name: product.name,
                image: product.image
            }
        }
    }

    async handleRequest(request: Request): Promise<void> {
        const validationResult = this.getValidationBodyResult(request.body)
        if (validationResult.error !== undefined) {
            this.validationError = validationResult.error

            return
        }

        this.data = {
            ...this.data,
            ...validationResult.value,
        }

        if (request.files?.attributes) {
            this.data.attributes.image = await this.handleImageFile(request.files.attributes as unknown as FileArray)
        }
    }

    isValid(): boolean {
        return this.validationError === null
    }

    getData(): UpdateProductFormData {
        if (this.data === null) {
            throw new Error('Form not handled')
        }

        return this.data
    }

    getError(): ValidationError | null {
        return this.validationError
    }

    private async handleImageFile(fileArray: FileArray): Promise<File> {
        const imageUploadedFile = fileArray.image as UploadedFile | UploadedFile[]
        const file = Array.isArray(imageUploadedFile) ? imageUploadedFile[0] : imageUploadedFile

        const resizedImageData = await sharp(file.data).resize(450, 200).toBuffer()

        return {
            mimeType: file.mimetype,
            name: file.name,
            data: resizedImageData,
            size: file.size
        }
    }

    private getValidationBodyResult(data: any): joi.ValidationResult<UpdateProductFormData> {
        const schema = joi.object({
            attributes: joi.object({
                name: joi.string()
            })
        })

        return schema.validate(data)
    }
}
