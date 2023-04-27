import { Identity } from '../../../domain/identity/identity'
import { UuidV1 } from '../../../infrastructure/identity/uuid-v1'

export class CreateCategoryCommand {
    readonly categoryId: Identity

    constructor (categoryId: string, public readonly name: string) {
        this.categoryId = new UuidV1(categoryId)
    }
}
