import { Identity } from '../identity/identity'
import { Image } from './image'

export class Product {
    readonly id: Identity
    readonly name: string
    readonly categoryId: Identity
    readonly storeId: Identity
    readonly image: Image | null

    constructor({ id, name, categoryId, storeId, image }: { id: Identity, name: string, categoryId: Identity, storeId: Identity, image: Image | null }) {
        this.id = id
        this.name = name
        this.categoryId = categoryId
        this.storeId = storeId
        this.image = image
    }

    changeName(newName: string): Product {
        return new Product({ ...this, name: newName })
    }
}
