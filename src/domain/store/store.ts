export class Store {
    readonly id: string
    readonly name: string
    readonly sellerId: string

    constructor({ id, name, sellerId }: { id: string, name: string, sellerId: string }) {
        this.id = id
        this.name = name
        this.sellerId = sellerId
    }

    changeName(newName: string): Store {
        return new Store({ ...this, name: newName })
    }
}
