import { Identity } from '../../../domain/identity/identity'
import { UuidV1 } from '../../../infrastructure/identity/uuid-v1'

export class ListProductsQuery {
    readonly storeId: Identity

    constructor(storeId: string) {
        this.storeId = new UuidV1(storeId)
    }
}
