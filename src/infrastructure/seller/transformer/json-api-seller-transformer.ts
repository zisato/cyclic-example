import { Seller } from '../../../domain/seller/seller'

type JsonApiSeller = {
    id: string
    attributes: {
        name: string
    }
}

export class JsonApiSellerTransformer {
    static transform(seller: Seller): JsonApiSeller {
        return {
            id: seller.id.value,
            attributes: {
                name: seller.name
            }
        }
    }
}
