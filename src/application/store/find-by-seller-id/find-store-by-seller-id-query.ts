import { Identity } from '../../../domain/identity/identity'
import { UuidV1 } from '../../../infrastructure/identity/uuid-v1'

export class FindStoreBySellerIdQuery {
    readonly sellerId: Identity

    constructor(sellerId: string) {
        this.sellerId = new UuidV1(sellerId)
    }
}
