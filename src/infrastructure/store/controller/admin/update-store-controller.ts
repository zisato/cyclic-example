import { Request, Response } from 'express'
import { Store } from '../../../../domain/store/store'
import FindStoreBySellerId from '../../../../application/store/find-by-seller-id/find-store-by-seller-id'
import { FindStoreBySellerIdQuery } from '../../../../application/store/find-by-seller-id/find-store-by-seller-id-query'
import UpdateStore from '../../../../application/store/update/update-store'
import { UpdateStoreCommand } from '../../../../application/store/update/update-store-command'
import { JsonApiStoreTransformer } from '../../transformer/json-api-store-transformer'
import { UpdateStoreForm } from '../../form/update-store-form'

export default class UpdateStoreController {
    constructor(private readonly findStoreBySellerId: FindStoreBySellerId, private readonly updateStore: UpdateStore) { }

    handle = async (req: Request, res: Response): Promise<void> => {
        const sellerId = await this.getSellerId(req)
        const store = await this.getStore(sellerId)

        if (req.method === 'POST') {
            const updateStoreForm = new UpdateStoreForm(store)

            await updateStoreForm.handleRequest(req)

            if (updateStoreForm.isValid()) {
                const updateStoreFormData = updateStoreForm.getData()

                await this.updateStore.execute(new UpdateStoreCommand(store.id.value, updateStoreFormData.attributes.name))
            }

            return res.redirect('/admin/stores/update')
        }

        const storeJsonApi = JsonApiStoreTransformer.transform(store)

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
}
