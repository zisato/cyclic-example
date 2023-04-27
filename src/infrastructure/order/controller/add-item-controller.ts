import { Request, Response } from 'express'
import * as joi from 'joi'
import { InvalidJsonSchemaError } from '../../error/invalid-json-schema-error'
import { AddItemToOrderCommand } from '../../../application/order/add-item/add-item-to-order-command'
import AddItemToOrder from '../../../application/order/add-item/add-item-to-order'

export default class AddItemController {
    constructor(private readonly addItemToOrder: AddItemToOrder) {}

    handle = async (req: Request, res: Response): Promise<void> => {
        const customerId = this.getCustomerId(req)
        const requestBody = this.ensureValidRequestBody(req)
        const command = new AddItemToOrderCommand(customerId, requestBody.attributes.product.id, requestBody.attributes.product.quantity)
        await this.addItemToOrder.execute(command)

        return res.redirect('/')
    }

    private ensureValidRequestBody(req: Request): any {
        const schema = joi.object({
            attributes: joi.object({
                product: joi.object({
                    id: joi.string().required(),
                    quantity: joi.number().default(1)
                }).required()
            }).required(),
        })
        const validationResult = schema.validate(req.body)

        if (validationResult.error != null) {
            throw new InvalidJsonSchemaError(validationResult.error.message)
        }

        return validationResult.value
    }

    private getCustomerId(req: Request): string {
        if (req.user === undefined || !('id' in req.user)) {
            throw new Error('Not authenticated customer')
        }

        return req.user.id as string
    }
}
