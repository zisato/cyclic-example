import { Request, Response } from 'express'
import ListStore from '../../application/store/list/list-store'
import { ListStoreQuery } from '../../application/store/list/list-store-query'
import JsonApiStoreTransformer from '../store/transformer/json-api-store-transformer'

export default class IndexController {
    constructor(
        private readonly listStore: ListStore,
        private readonly jsonApiStoreTransformer: JsonApiStoreTransformer
    ) { }

    handle = async (_req: Request, res: Response): Promise<void> => {
        const query = new ListStoreQuery()

        const stores = await this.listStore.execute(query)
        const storesJsonApi = this.jsonApiStoreTransformer.transformArray(stores)

        res.render('store/list', {
            stores: storesJsonApi
        })
    }
}
