import { Request, Response } from 'express'
import CompleteOrder from '../../../application/order/complete-order/complete-order'
import { CompleteOrderCommand } from '../../../application/order/complete-order/complete-order-command'

export default class CompleteOrderController {
    constructor(private readonly completeOrder: CompleteOrder) {}

    handle = async (req: Request, res: Response): Promise<void> => {
        const customerId = this.getCustomerId(req)
        const command = new CompleteOrderCommand(req.params.orderId, customerId)
        await this.completeOrder.execute(command)

        return res.redirect('back')
    }

    private getCustomerId(req: Request): string {
        if (req.user === undefined || !('id' in req.user)) {
            throw new Error('Not authenticated customer')
        }

        return req.user.id as string
    }
}
