import { Seller } from '../../../domain/seller/seller'
import { SellerRepository } from '../../../domain/seller/repository/seller-repository'
import { Identity } from '../../../domain/identity/identity'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { UuidV1 } from '../../identity/uuid-v1'
import { DynamodbRepository } from '../../dynamodb/dynamodb-repository'

export default class DynamodbSellerRepository extends DynamodbRepository<Seller> implements SellerRepository {
    private readonly tableName = 'seller'

    constructor(dynamoDBClient: DynamoDBClient) {
        super(dynamoDBClient)
    }

    getTableName(): string {
        return this.tableName
    }

    async find(): Promise<Seller[]> {
        return await this.listItems()
    }

    async exists (id: Identity): Promise<boolean> {
        return await this.getItem(id.value) !== undefined
    }

    async save (seller: Seller): Promise<void> {
        await this.saveItem(seller)
    }

    modelToItem(seller: Seller): Record<string, any> {
        return {
            id: { S: seller.id.value },
            name: { S: seller.name }
        }
    }

    itemToModel(item: Record<string, any>): Seller {
        if (!item.id) {
            throw new Error('Required id property')
        }

        if (!item.name) {
            throw new Error('Required name property')
        }

        return new Seller({
            id: new UuidV1(item.id),
            name: item.name
        })
    }
}
