import { Request, Response } from 'express'
import RemoveItemFromOrder from '../../../application/order/remove-item/remove-item-from-order'
import { RemoveItemFromOrderCommand } from '../../../application/order/remove-item/remove-item-from-order-command'

export default class RemoveItemController {
    constructor(private readonly removeItemFromOrder: RemoveItemFromOrder) {}

    handle = async (req: Request, res: Response): Promise<void> => {
        const customerId = this.getCustomerId(req)
        const command = new RemoveItemFromOrderCommand(customerId, req.params.productId)
        await this.removeItemFromOrder.execute(command)

        return res.redirect('back')
    }

    private getCustomerId(req: Request): string {
        if (req.user === undefined || !('id' in req.user)) {
            throw new Error('Not authenticated customer')
        }

        return req.user.id as string
    }
}
