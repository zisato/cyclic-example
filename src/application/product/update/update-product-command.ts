import { Identity } from '../../../domain/identity/identity'
import { UuidV1 } from '../../../infrastructure/identity/uuid-v1'

export class UpdateProductCommand {
    readonly id: Identity
    readonly name?: string
    readonly image?: string

    constructor(id: string, name?: string, image?: string) {
        this.id = new UuidV1(id)
        this.name = name
        this.image = image
    }
}
