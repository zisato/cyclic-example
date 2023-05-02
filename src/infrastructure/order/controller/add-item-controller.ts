import { Request, Response } from 'express'
import { AddItemToOrderCommand } from '../../../application/order/add-item/add-item-to-order-command'
import AddItemToOrder from '../../../application/order/add-item/add-item-to-order'
import { AddItemForm } from '../form/add-item-form'

export default class AddItemController {
    constructor(private readonly addItemToOrder: AddItemToOrder) {}

    handle = async (req: Request, res: Response): Promise<void> => {
        const addItemForm = new AddItemForm()
    
        await addItemForm.handleRequest(req)

        if (addItemForm.isValid()) {
            const customerId = this.getCustomerId(req)
            const addItemFormData = addItemForm.getData()

            const command = new AddItemToOrderCommand(customerId, addItemFormData.attributes.product.id, addItemFormData.attributes.product.quantity)
            await this.addItemToOrder.execute(command)
        }

        return res.redirect('back')
    }

    private getCustomerId(req: Request): string {
        if (req.user === undefined || !('id' in req.user)) {
            throw new Error('Not authenticated customer')
        }

        return req.user.id as string
    }
}
