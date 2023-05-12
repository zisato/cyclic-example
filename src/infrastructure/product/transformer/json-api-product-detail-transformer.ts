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

    async transformArray(products: Product[]): Promise<JsonApiProductDetail[]> {
        const result = []

        for (const product of products) {
            result.push(await this.transform(product))
        }

        return result
    }

    async transform(product: Product): Promise<JsonApiProductDetail> {
        const imageAsDataUrl = await this.getFileAsDataUrl(product.imageFilename)

        return {
            id: product.id.value,
            attributes: {
                name: product.name,
                image: imageAsDataUrl
            }
        }
    }

    private async getFileAsDataUrl(imageFilename: string | null): Promise<string | null> {
        if (!imageFilename) {
            return null
        }

        const file = await this.fileStorageService.get(imageFilename)

        return file.asDataUrl()
    }
}
