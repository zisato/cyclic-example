import * as joi from 'joi'
import { Request } from 'express'
import { ValidationError } from 'joi'
import { Form } from './form'
import deepmerge from 'deepmerge'
import { UploadedFile } from 'express-fileupload'

interface UploadedFileObject {
    [key: string]: UploadedFile | UploadedFile[] | UploadedFileObject
}

export abstract class AbstractForm<T extends {}> implements Form<T> {
    private isSubmitted: boolean = false
    private validationError: ValidationError | null = null
    private data: T | null = null

    abstract getValidationBodySchema(): joi.ObjectSchema<T>

    async handleRequest(request: Request): Promise<void> {
        if (this.isSubmitted) {
            throw new Error('Form can only be submitted once')
        }

        this.isSubmitted = true

        const validationSchema = this.getValidationBodySchema()
        const validationResult = validationSchema.validate(request.body)

        if (validationResult.error !== undefined) {
            this.validationError = validationResult.error

            return
        }

        const currentData = this.data ?? {}

        this.data = deepmerge(currentData, validationResult.value) as T

        if (request.files) {
            this.data = deepmerge(this.data, request.files as UploadedFileObject, {
                clone: false,
                isMergeableObject: (value: object): boolean => {
                    return !this.isUploadedFile(value)
                }
            }) as T
        }
    }

    isValid(): boolean {
        if (!this.isSubmitted) {
            throw new Error('Cannot check isValid from an unsubmitted form')
        }

        return this.validationError === null
    }

    getData(): T {
        if (!this.isSubmitted) {
            throw new Error('Cannot getData from an unsubmitted form')
        }
        
        if (this.data === null) {
            throw new Error('Data cannot be null when submitted form')
        }

        return this.data
    }

    getError(): ValidationError | null {
        if (!this.isSubmitted) {
            throw new Error('Cannot getError from an unsubmitted form')
        }

        return this.validationError
    }

    protected setData(data: T): void {
        this.data = data
    }

    private isUploadedFile(item: object): item is UploadedFile {
        return typeof item === 'object' && 'name' in item && 'mimetype' in item && 'data' in item && 'size' in item  
    }

    /*
    private async handleFilesRecursive(files: UploadedFileObject): Promise<any> {
        const result: any = {}
        const keys = Object.keys(files)

        for (const key of keys) {
            const currentItem = files[key]

            if (Array.isArray(currentItem) || this.isUploadedFile(currentItem)) {
                result[key] = currentItem

                continue
            }

            result[key] = await this.handleFilesRecursive(currentItem)
        }

        return result
    }

    private isUploadedFile(item: any): item is UploadedFile {
        return 'name' in item && 'mimetype' in item && 'data' in item && 'size' in item  
    }
    */
}
