export class Seller {
    readonly id
    readonly name

    constructor({ id, name }: { id: string, name: string }) {
        this.id = id
        this.name = name
    }

    changeName(newName: string): Seller {
        return new Seller({ ...this, name: newName })
    }
}
