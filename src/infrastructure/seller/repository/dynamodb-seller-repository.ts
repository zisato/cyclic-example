import { Seller } from '../../../domain/seller/seller'
import { SellerRepository } from '../../../domain/seller/repository/seller-repository'
// import CyclicDB from '@cyclic.sh/dynamodb'
// import CyclicItem from '@cyclic.sh/dynamodb/dist/cy_db_item'
import { Identity } from '../../../domain/identity/identity'
import { AttributeValue, DynamoDBClient, GetItemCommand, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb'
import { UuidV1 } from '../../identity/uuid-v1'
// import { UuidV1 } from '../../identity/uuid-v1'

export default class DynamodbSellerRepository implements SellerRepository {
    private readonly tableName = 'seller'

    constructor(private readonly dynamoDBClient: DynamoDBClient) {}

    async find(): Promise<Seller[]> {
        const results = await this.dynamoDBClient.send(new QueryCommand({
            TableName: this.tableName
        }))

        if (!results.Items) {
            return []
        }

        return results.Items.map((item) => {
            return this.itemToSeller(item)
        })
        /*
        const collection = this.cyclicDB.collection(this.collectionName)
        const results: Seller[] = []
        const dbResults = (await collection.list()).results

        for (const result of dbResults) {
            const item: CyclicItem = await result.get()
            const seller = new Seller({
                id: new UuidV1(item.key),
                name: item.props.name
            })

            results.push(seller)
        }

        return results
        */
    }

    async exists (id: Identity): Promise<boolean> {
        const result = await this.dynamoDBClient.send(new GetItemCommand({
            TableName: this.tableName,
            Key: {
                id: { S: id.value }
            }
        }))

        return result.Item !== undefined
        /*
        const collection = this.cyclicDB.collection(this.collectionName)

        return await collection.get(id.value) !== null
        */
    }

    async save (seller: Seller): Promise<void> {
        const item = this.sellerToItem(seller)

        await this.dynamoDBClient.send(new PutItemCommand({
            TableName: this.tableName,
            Item: item
        }))
        /*
        const collection = this.cyclicDB.collection(this.collectionName)

        await collection.set(
            seller.id.value,
            {
                name: seller.name
            },
            {}
        )
        */
    }

    private sellerToItem(seller: Seller): Record<string, AttributeValue> {
        return {
            id: { S: seller.id.value },
            name: { S: seller.name }
        }
    }

    private itemToSeller(item: Record<string, AttributeValue>): Seller {
        if (!item.id.S) {
            throw new Error('Required id property')
        }

        if (!item.name.S) {
            throw new Error('Required name property')
        }

        return new Seller({
            id: new UuidV1(item.id.S),
            name: item.name.S
        })
    }
}
