import { Request } from 'express'
import { ValidationError } from 'joi'

export interface Form<T> {
    handleRequest(request: Request): Promise<void>

    isValid(): boolean

    getData(): T

    getError(): ValidationError | null
}
