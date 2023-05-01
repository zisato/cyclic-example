import { Category } from '../../../domain/category/category'

type JsonApiCategory = {
    id: string
    attributes: {
        name: string
    }
}

export class JsonApiCategoryTransformer {
    static transform(category: Category): JsonApiCategory {
        return {
            id: category.id.value,
            attributes: {
                name: category.name
            }
        }
    }
}
