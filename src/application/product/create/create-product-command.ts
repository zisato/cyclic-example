import { Identity } from '../../../domain/identity/identity'
import { UuidV1 } from '../../../infrastructure/identity/uuid-v1'
import { Image } from '../../../domain/product/image'

export class CreateProductCommand {
    readonly id: Identity
    readonly name: string
    readonly categoryId: Identity
    readonly storeId: Identity
    readonly image?: Image

    constructor (
        id: string,
        name: string,
        categoryId: string,
        storeId: string,
        image?: Image
    ) {
        this.id = new UuidV1(id)
        this.name = name
        this.categoryId = new UuidV1(categoryId)
        this.storeId = new UuidV1(storeId)
        this.image = image
    }
}
