export class Product {
    readonly id
    readonly name
    readonly categoryId
    readonly storeId

    constructor({ id, name, categoryId, storeId }: { id: string, name: string, categoryId: string, storeId: string }) {
        this.id = id
        this.name = name
        this.categoryId = categoryId
        this.storeId = storeId
    }
}
