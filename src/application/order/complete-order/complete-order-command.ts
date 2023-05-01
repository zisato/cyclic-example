import { Identity } from '../../../domain/identity/identity'
import { UuidV1 } from '../../../infrastructure/identity/uuid-v1'

export class CompleteOrderCommand {
    readonly orderId: Identity
    readonly customerId: Identity

    constructor(id: string, customerId: string) {
        this.orderId = new UuidV1(id)
        this.customerId = new UuidV1(customerId)
    }
}
