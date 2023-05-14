import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Category } from '../../../domain/category/category'
import { CategoryRepository } from '../../../domain/category/repository/category-repository'
import { Identity } from '../../../domain/identity/identity'
import { UuidV1 } from '../../identity/uuid-v1'
import { DynamodbRepository } from '../../dynamodb/dynamodb-repository'

export default class DynamodbCategoryRepository extends DynamodbRepository<Category> implements CategoryRepository {
    private readonly tableName = 'category'

    constructor(dynamoDBClient: DynamoDBClient) {
        super(dynamoDBClient)
    }

    getTableName(): string {
        return this.tableName
    }

    async find(): Promise<Category[]> {
        return await this.listItems()
    }

    async exists(id: Identity): Promise<boolean> {
        return await this.getItem(id.value) !== undefined
    }

    async save(category: Category): Promise<void> {
        await this.saveItem(category)
    }

    async delete(id: Identity): Promise<void> {
        await this.deleteItem(id.value)
    }

    modelToItem(model: Category): Record<string, any> {
        return {
            id: model.id.value,
            name: model.name
        }
    }

    itemToModel(item: Record<string, any>): Category {
        if (!item.id) {
            throw new Error('Required id property')
        }

        if (!item.name) {
            throw new Error('Required name property')
        }

        return new Category({
            id: new UuidV1(item.id),
            name: item.name
        })
    }
}
