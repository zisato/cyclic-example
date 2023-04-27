import { Identity } from '../../../domain/identity/identity'
import { UuidV1 } from '../../../infrastructure/identity/uuid-v1'

export class CreateStoreCommand {
    readonly id: Identity
    readonly name: string
    readonly sellerId: Identity

    constructor(id: string, name: string, sellerId: string) {
        this.id = new UuidV1(id)
        this.name = name
        this.sellerId = new UuidV1(sellerId)
    }
}
