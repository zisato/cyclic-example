import { Identity } from '../../../domain/identity/identity'
import { UuidV1 } from '../../../infrastructure/identity/uuid-v1'

export class FindProductByIdQuery {
    readonly id: Identity

    constructor(id: string) {
        this.id = new UuidV1(id)
    }
}
