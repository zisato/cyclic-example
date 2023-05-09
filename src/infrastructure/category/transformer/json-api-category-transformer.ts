import { Category } from '../../../domain/category/category'

type JsonApiCategory = {
    id: string
    attributes: {
        name: string
    }
}

export default class JsonApiCategoryTransformer {
    transformArray(categories: Category[]): JsonApiCategory[] {
        return categories.map((category: Category) => {
            return this.transform(category)
        })
    }

    transform(category: Category): JsonApiCategory {
        return {
            id: category.id.value,
            attributes: {
                name: category.name
            }
        }
    }
}
