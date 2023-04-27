import { Request, Response } from 'express'
import ListStore from '../../../application/store/list/list-store'
import { ListStoreQuery } from '../../../application/store/list/list-store-query'
import { Store } from '../../../domain/store/store'
import CustomerOrderDetail from '../../../application/order/detail/customer-order-detail'
import { CustomerOrderDetailCommand } from '../../../application/order/detail/customer-order-detail-command'

export default class ListStoreController {
    constructor(private readonly listStore: ListStore, private readonly customerOrderDetail: CustomerOrderDetail) { }

    handle = async (req: Request, res: Response): Promise<void> => {
        const customerId = await this.getCustomerId(req)

        const stores = await this.listStore.execute(new ListStoreQuery())
        const storesJsonApi = stores.map((store: Store) => {
            return {
                id: store.id,
                attributes: {
                    name: store.name
                }
            }
        })

        const order = await this.customerOrderDetail.execute(new CustomerOrderDetailCommand(customerId))
        const orderJsonApi = {
            id: order.id,
            attributes: {
                items: order.items
            }
        }

        res.status(200).render('store/list', {
            stores: storesJsonApi,
            order: orderJsonApi
        })
    }

    private async getCustomerId(req: Request): Promise<string> {
        if (req.user === undefined || !('id' in req.user)) {
            throw new Error('Not authenticated customer')
        }

        return req.user.id as string
    }
}
