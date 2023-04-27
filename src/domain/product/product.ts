import { Identity } from "../identity/identity"

export class Product {
    readonly id: Identity
    readonly name: string
    readonly categoryId: Identity
    readonly storeId: Identity

    constructor({ id, name, categoryId, storeId }: { id: Identity, name: string, categoryId: Identity, storeId: Identity }) {
        this.id = id
        this.name = name
        this.categoryId = categoryId
        this.storeId = storeId
    }

    changeName(newName: string): Product {
        return new Product({ ...this, name: newName })
    }
}
