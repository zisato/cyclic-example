import { Seller } from '../../../domain/seller/seller'
import { SellerRepository } from '../../../domain/seller/repository/seller-repository'
import CyclicDB from '@cyclic.sh/dynamodb'
import CyclicItem from '@cyclic.sh/dynamodb/dist/cy_db_item'

export default class DynamodbSellerRepository implements SellerRepository {
    private readonly collectionName = 'seller'
    constructor(private readonly cyclicDB: typeof CyclicDB) {}

    async find(): Promise<Seller[]> {
        const collection = this.cyclicDB.collection(this.collectionName)
        const results: Seller[] = []
        const dbResults = (await collection.list()).results

        for (const result of dbResults) {
            const item: CyclicItem = await result.get()
            const seller = new Seller({
                id: item.key,
                name: item.props.name
            })

            results.push(seller)
        }

        return results
    }

    async exists (id: string): Promise<boolean> {
        const collection = this.cyclicDB.collection(this.collectionName)

        return await collection.get(id) !== null
    }

    async save (seller: Seller): Promise<void> {
        const collection = this.cyclicDB.collection(this.collectionName)

        await collection.set(
            seller.id,
            {
                name: seller.name
            },
            {}
        )
    }
}
