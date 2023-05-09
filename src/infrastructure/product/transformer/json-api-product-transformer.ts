import { Product } from '../../../domain/product/product'

type JsonApiProduct = {
    id: string
    attributes: {
        name: string
    }
}

export default class JsonApiProductTransformer {
    transformArray(products: Product[]): JsonApiProduct[] {
        return products.map((product: Product) => {
            return this.transform(product)
        })
    }

    transform(product: Product): JsonApiProduct {
        return {
            id: product.id.value,
            attributes: {
                name: product.name
            }
        }
    }
}
