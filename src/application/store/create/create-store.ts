import { CreateStoreCommand } from './create-store-command'
import { CreateStoreService } from '../../../domain/store/service/create-store-service'
import { StoreRepository } from '../../../domain/store/repository/store-repository'
import { SellerRepository } from '../../../domain/seller/repository/seller-repository'

export default class CreateStore {
    constructor(private readonly storeRepository: StoreRepository, private readonly sellerRepository: SellerRepository) { }

    async execute(command: CreateStoreCommand): Promise<void> {
        const service = new CreateStoreService(this.storeRepository, this.sellerRepository)

        await service.create(command.id, command.name, command.sellerId)
    }
}
