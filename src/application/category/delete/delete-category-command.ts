import { Identity } from '../../../domain/identity/identity'
import { UuidV1 } from '../../../infrastructure/identity/uuid-v1'

export class DeleteCategoryCommand {
    readonly categoryId: Identity

    constructor (categoryId: string) {
        this.categoryId = new UuidV1(categoryId)
    }
}
