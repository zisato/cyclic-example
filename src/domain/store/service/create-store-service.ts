import { Store } from '../store'
import { StoreRepository } from '../repository/store-repository'
import { InvalidArgumentError } from '../../error/invalid-argument-error'
import { SellerRepository } from '../../seller/repository/seller-repository'
import { ModelNotFoundError } from '../../error/model-not-found-error'

export class CreateStoreService {
    constructor(private readonly storeRepository: StoreRepository, private readonly sellerRepository: SellerRepository) { }

    async create(id: string, name: string, sellerId: string): Promise<void> {
        await this.ensureStoreIdNotExists(id)
        await this.ensureSellerIdExists(sellerId)

        const store = new Store({ id, name, sellerId })

        await this.storeRepository.save(store)
    }

    private async ensureStoreIdNotExists(id: string): Promise<void> {
        if (await this.storeRepository.exists(id)) {
            throw new InvalidArgumentError(`Existing Store with id ${id}`)
        }
    }

    private async ensureSellerIdExists(id: string): Promise<void> {
        if (!await this.sellerRepository.exists(id)) {
            throw new ModelNotFoundError(`Seller with id ${id} not found`)
        }
    }
}
