import { Request, Response } from 'express'
import ListStore from '../../../application/store/list/list-store'
import { ListStoreQuery } from '../../../application/store/list/list-store-query'
import { Store } from '../../../domain/store/store'

export default class ListStoreController {
    constructor(private readonly listStore: ListStore) { }

    handle = async (_req: Request, res: Response): Promise<void> => {
        const query = new ListStoreQuery()

        const stores = await this.listStore.execute(query)
        const storesJsonApi = stores.map((store: Store) => {
            return {
                id: store.id,
                attributes: {
                    name: store.name
                }
            }
        })

        res.render('store/list', {
            stores: storesJsonApi
        })
    }
}
