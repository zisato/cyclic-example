import { Identity } from '../../../domain/identity/identity'
import { Image } from '../../../domain/product/image'
import { UuidV1 } from '../../../infrastructure/identity/uuid-v1'

export class UpdateProductCommand {
    readonly id: Identity
    readonly name?: string
    readonly image?: Image | null

    constructor(id: string, name?: string, image?: Image | null) {
        this.id = new UuidV1(id)
        this.name = name
        this.image = image
    }
}
