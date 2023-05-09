import * as joi from 'joi'
import { Request } from 'express'
import { FileArray } from 'express-fileupload'
import { File } from '../../file-storage/file'
import { ValidationError } from 'joi'
// import sharp from 'sharp'
import { Form } from '../../form/form'

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

export class CreateProductFormCopy implements Form<CreateProductFormData> {
    private validationError: ValidationError | null = null
    private data: CreateProductFormData | null = null

    async handleRequest(request: Request): Promise<void> {
        const validationResult = this.getValidationBodyResult(request.body)
        if (validationResult.error !== undefined) {
            this.validationError = validationResult.error

            return
        }

        this.data = validationResult.value

        if (request.files) {
            const handledFiles = this.handleFilesRecursive(request.files)

            this.data = {
                ...this.data,
                ...handledFiles
            }
        }

        /*
        if (request.files?.attributes) {
            this.data.attributes.image = await this.handleFile((request.files.attributes as any).image as UploadedFile | UploadedFile[])
        }
        */
    }

    private handleFilesRecursive(files: FileArray): any {
        for (const key in files) {
            console.log('CreateProductForm handleRecursive', files[key].constructor.toString())
        }

        return {}
    }

    isValid(): boolean {
        return this.validationError === null
    }

    getData(): CreateProductFormData {
        if (this.data === null) {
            throw new Error('Form not handled')
        }

        return this.data
    }

    getError(): ValidationError | null {
        return this.validationError
    }

    /*
    private async handleFile(uploadedFile: UploadedFile | UploadedFile[]): Promise<File> {
        const file = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile

        const resizedImageData = await sharp(file.data).resize(450, 200).toBuffer()

        return {
            mimeType: file.mimetype,
            name: file.name,
            data: resizedImageData,
            size: file.size
        }
    }
    */

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
