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

    transform(orderItem: OrderItemDetail): JsonApiOrderItem {
        const fileAsDataUrl = this.getFileAsDataUrl(orderItem.image)

        return {
            productId: orderItem.productId,
            name: orderItem.name,
            image: fileAsDataUrl,
            quantity: orderItem.quantity
        }
    }

    private getFileAsDataUrl(fileName: string | null): string | null {
        if (fileName === null) {
            return null
        }

        return this.fileStorageService.get(fileName).asDataUrl()
    }
}
