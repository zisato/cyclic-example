import { Identity } from '../identity/identity'
import { Image } from './image'

export class Product {
    readonly id: Identity
    readonly name: string
    readonly categoryId: Identity
    readonly storeId: Identity
    readonly image: Image | null

    constructor({ id, name, categoryId, storeId, image = null }: { id: Identity, name: string, categoryId: Identity, storeId: Identity, image?: Image | null }) {
        this.id = id
        this.name = name
        this.categoryId = categoryId
        this.storeId = storeId
        this.image = image
    }

    changeName(newName: string): Product {
        return new Product({ ...this, name: newName })
    }

    changeImage(newImage: Image | null): Product {
        return new Product({ ...this, image: newImage })
    }

    imageAsDataUrl(): string | null {
        if (this.image === null) {
            return null
        }

        return `data:${this.image.mimeType};base64, ${this.image.data.toString('base64')}`
    }
}
