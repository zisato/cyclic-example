export class Seller {
    readonly id: string
    readonly name: string

    constructor({ id, name }: { id: string, name: string }) {
        this.id = id
        this.name = name
    }

    changeName(newName: string): Seller {
        return new Seller({ ...this, name: newName })
    }
}
