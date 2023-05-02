import { Identity } from '../../../domain/identity/identity'
import { UuidV1 } from '../../../infrastructure/identity/uuid-v1'

export class RemoveItemFromOrderCommand {
    readonly customerId: Identity
    readonly productId: Identity

    constructor(customerId: string, productId: string) {
        this.customerId = new UuidV1(customerId)
        this.productId = new UuidV1(productId)
    }
}
