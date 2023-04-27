import { Identity } from '../identity/identity'

export class Seller {
    readonly id: Identity
    readonly name: string

    constructor({ id, name }: { id: Identity, name: string }) {
        this.id = id
        this.name = name
    }

    changeName(newName: string): Seller {
        return new Seller({ ...this, name: newName })
    }
}
