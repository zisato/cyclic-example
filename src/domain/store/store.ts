export class Store {
    readonly id
    readonly name
    readonly sellerId

    constructor({ id, name, sellerId }: { id: string, name: string, sellerId: string }) {
        this.id = id
        this.name = name
        this.sellerId = sellerId
    }

    changeName(newName: string): Store {
        return new Store({ ...this, name: newName })
    }
}
