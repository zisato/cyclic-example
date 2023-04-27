import { Identity } from '../identity/identity'

export class Customer {
    readonly id: Identity
    readonly name: string

    constructor({ id, name }: { id: Identity, name: string }) {
        this.id = id
        this.name = name
    }
}
