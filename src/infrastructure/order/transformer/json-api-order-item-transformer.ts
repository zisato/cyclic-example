import { OrderItemDetail } from '../../../application/order/find-by-customer-id/find-order-by-customer-id'
import { FileStorageService } from '../../file-storage/file-storage-service'

type JsonApiOrderItem = {
    productId: string
    name: string
    quantity: number
    image: string | null
}

export default class JsonApiOrderItemTransformer {
    constructor(private readonly fileStorageService: FileStorageService) {}

    async transform(orderItem: OrderItemDetail): Promise<JsonApiOrderItem> {
        const fileAsDataUrl = await this.getFileAsDataUrl(orderItem.image)

        return {
            productId: orderItem.productId,
            name: orderItem.name,
            image: fileAsDataUrl,
            quantity: orderItem.quantity
        }
    }

    private async getFileAsDataUrl(fileName: string | null): Promise<string | null> {
        if (fileName === null) {
            return null
        }

        const file = await this.fileStorageService.get(fileName)

        return file.asDataUrl()
    }
}
