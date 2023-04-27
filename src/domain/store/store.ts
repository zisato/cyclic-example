import { Identity } from '../identity/identity'

export class Store {
    readonly id: Identity
    readonly name: string
    readonly sellerId: Identity

    constructor({ id, name, sellerId }: { id: Identity, name: string, sellerId: Identity }) {
        this.id = id
        this.name = name
        this.sellerId = sellerId
    }

    changeName(newName: string): Store {
        return new Store({ ...this, name: newName })
    }
}
