import * as joi from 'joi'
import { Request, Response } from 'express'
import { Store } from '../../../../domain/store/store'
import FindStoreBySellerId from '../../../../application/store/find-by-seller-id/find-store-by-seller-id'
import { FindStoreBySellerIdQuery } from '../../../../application/store/find-by-seller-id/find-store-by-seller-id-query'
import UpdateStore from '../../../../application/store/update/update-store'
import { UpdateStoreCommand } from '../../../../application/store/update/update-store-command'
import { InvalidJsonSchemaError } from '../../../error/invalid-json-schema-error'

export default class UpdateStoreController {
    constructor(private readonly findStoreBySellerId: FindStoreBySellerId, private readonly updateStore: UpdateStore) { }

    handle = async (req: Request, res: Response): Promise<void> => {
        const sellerId = await this.getSellerId(req)
        const store = await this.getStore(sellerId)

        if (req.method === 'POST') {
            const requestBody = this.ensureValidRequestBody(req)
            await this.updateStore.execute(new UpdateStoreCommand(store.id, requestBody.attributes.name))

            return res.redirect('/admin/stores/update')
        }

        const storeJsonApi = {
            id: store.id,
            attributes: {
                name: store.name
            }
        }

        res.status(200).render('admin/store/update', {
            store: storeJsonApi
        })
    }

    private async getSellerId(req: Request): Promise<string> {
        if (req.user === undefined || !('id' in req.user)) {
            throw new Error('Not authenticated customer')
        }

        return req.user.id as string
    }

    private async getStore(sellerId: string): Promise<Store> {
        return await this.findStoreBySellerId.execute(new FindStoreBySellerIdQuery(sellerId))
    }

    private ensureValidRequestBody(req: Request): any {
        const schema = joi.object({
            attributes: joi.object({
                name: joi.string().required()
            }).required()
        })
        const validationResult = schema.validate(req.body)

        if (validationResult.error != null) {
            throw new InvalidJsonSchemaError(validationResult.error.message)
        }

        return validationResult.value
    }
}
