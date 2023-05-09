import { Identity } from '../identity/identity'

export class Product {
    readonly id: Identity
    readonly name: string
    readonly categoryId: Identity
    readonly storeId: Identity
    readonly imageFilename: string | null

    constructor({ id, name, categoryId, storeId, imageFilename = null }: { id: Identity, name: string, categoryId: Identity, storeId: Identity, imageFilename?: string | null }) {
        this.id = id
        this.name = name
        this.categoryId = categoryId
        this.storeId = storeId
        this.imageFilename = imageFilename
    }

    changeName(newName: string): Product {
        return new Product({ ...this, name: newName })
    }

    changeImageFilename(newImageFilename: string | null): Product {
        return new Product({ ...this, imageFilename: newImageFilename })
    }

    /*
    imageAsDataUrl(): string | null {
        if (this.image === null) {
            return null
        }

        return `data:${this.image.mimeType};base64, ${this.image.data.toString('base64')}`
    }
    */
}
