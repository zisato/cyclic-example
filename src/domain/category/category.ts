import { Identity } from '../identity/identity'

export class Category {
    readonly id: Identity
    readonly name: string

    constructor({ id, name }: { id: Identity, name: string }) {
        this.id = id
        this.name = name
    }
}
