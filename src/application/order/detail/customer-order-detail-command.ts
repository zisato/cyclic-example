import { Identity } from '../../../domain/identity/identity'
import { UuidV1 } from '../../../infrastructure/identity/uuid-v1'

export class CustomerOrderDetailCommand {
    readonly customerId: Identity

    constructor(customerId: string) {
        this.customerId = new UuidV1(customerId)
    }
}
