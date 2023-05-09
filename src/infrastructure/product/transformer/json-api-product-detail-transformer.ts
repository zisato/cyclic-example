import { Product } from '../../../domain/product/product'
import { FileStorageService } from '../../file-storage/file-storage-service'

type JsonApiProductDetail = {
    id: string
    attributes: {
        name: string
        image: string | null
    }
}

export default class JsonApiProductDetailTransformer {
    constructor(private readonly fileStorageService: FileStorageService) {}

    transformArray(products: Product[]): JsonApiProductDetail[] {
        return products.map((product: Product) => {
            return this.transform(product)
        })
    }

    transform(product: Product): JsonApiProductDetail {
        const imageAsDataUrl = this.getFileAsDataUrl(product.imageFilename)

        return {
            id: product.id.value,
            attributes: {
                name: product.name,
                image: imageAsDataUrl
            }
        }
    }

    private getFileAsDataUrl(imageFilename: string | null): string | null {
        if (!imageFilename) {
            return null
        }

        const file = this.fileStorageService.get(imageFilename)

        return file.asDataUrl()
    }
}
