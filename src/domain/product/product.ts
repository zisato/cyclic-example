export class Product {
    readonly id: string
    readonly name: string
    readonly categoryId: string
    readonly storeId: string

    constructor({ id, name, categoryId, storeId }: { id: string, name: string, categoryId: string, storeId: string }) {
        this.id = id
        this.name = name
        this.categoryId = categoryId
        this.storeId = storeId
    }

    changeName(newName: string): Product {
        return new Product({ ...this, name: newName })
    }
}
