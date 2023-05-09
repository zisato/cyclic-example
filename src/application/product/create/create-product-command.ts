import { Identity } from '../../../domain/identity/identity'
import { UuidV1 } from '../../../infrastructure/identity/uuid-v1'

export class CreateProductCommand {
    readonly id: Identity
    readonly name: string
    readonly categoryId: Identity
    readonly storeId: Identity
    readonly imageFilename?: string

    constructor (
        id: string,
        name: string,
        categoryId: string,
        storeId: string,
        imageFilename?: string
    ) {
        this.id = new UuidV1(id)
        this.name = name
        this.categoryId = new UuidV1(categoryId)
        this.storeId = new UuidV1(storeId)
        this.imageFilename = imageFilename
    }
}
