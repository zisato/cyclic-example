import { Product } from '../../../domain/product/product'

type JsonApiProduct = {
    id: string
    attributes: {
        name: string
        image: string | null
    }
}

export class JsonApiProductTransformer {
    static transform(product: Product): JsonApiProduct {
        return {
            id: product.id.value,
            attributes: {
                name: product.name,
                image: product.imageAsDataUrl()
            }
        }
    }
}
