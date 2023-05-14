import { CreateTableCommand, DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb'
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'

export abstract class DynamodbRepository<T extends { id: any }> {
    private readonly dynamoDBDocumentClient: DynamoDBDocumentClient

    abstract getTableName(): string
    abstract itemToModel(item: any): T
    abstract modelToItem(model: T): any

    constructor(dynamoDBClient: DynamoDBClient) {
        this.createTableWhenNotExists(dynamoDBClient)
        this.dynamoDBDocumentClient = DynamoDBDocumentClient.from(dynamoDBClient)
    }

    protected async listItems(): Promise<T[]> {
        const results = await this.dynamoDBDocumentClient.send(new ScanCommand({
            TableName: this.getTableName()
        }))

        if (!results.Items) {
            return []
        }

        return results.Items.map((item) => {
            return this.itemToModel(item)
        })
    }

    protected async getItem(id: string): Promise<T | undefined> {
        const result = await this.dynamoDBDocumentClient.send(new GetCommand({
            TableName: this.getTableName(),
            Key: {
                id: id
            }
        }))

        if (!result.Item) {
            return undefined
        }

        return this.itemToModel(result.Item)
    }

    protected async saveItem(model: T): Promise<void> {
        const item = this.modelToItem(model)

        await this.dynamoDBDocumentClient.send(new PutCommand({
            TableName: this.getTableName(),
            Item: item
        }))
    }

    protected async deleteItem(id: string): Promise<void> {
        const result = await this.dynamoDBDocumentClient.send(new DeleteCommand({
            TableName: this.getTableName(),
            Key: {
                id: id
            }
        }))

        console.log('Delete result', result)
    }

    private async createTableWhenNotExists(dynamoDBClient: DynamoDBClient): Promise<void> {
        const existsTable = await this.existsTable(dynamoDBClient)

        if (!existsTable) {
            const result = await dynamoDBClient.send(new CreateTableCommand({
                TableName: this.getTableName(),
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1
                },
                AttributeDefinitions: [
                    {
                        AttributeName: 'id',
                        AttributeType: 'S'
                    }
                ],
                KeySchema: [
                    {
                        AttributeName: 'id',
                        KeyType: 'HASH'
                    }
                ]
            }))

            console.log('Create table result', result)
        }
    }

    private async existsTable(dynamoDBClient: DynamoDBClient): Promise<boolean> {
        const tables = await dynamoDBClient.send(new ListTablesCommand({}))
        if (!tables.TableNames) {
            return false
        }

        return tables.TableNames.some((table) => {
            return table === this.getTableName()
        })
    }
}
