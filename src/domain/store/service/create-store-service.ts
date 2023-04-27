import { Store } from '../store'
import { StoreRepository } from '../repository/store-repository'
import { InvalidArgumentError } from '../../error/invalid-argument-error'
import { SellerRepository } from '../../seller/repository/seller-repository'
import { ModelNotFoundError } from '../../error/model-not-found-error'
import { Identity } from '../../identity/identity'

export class CreateStoreService {
    constructor(private readonly storeRepository: StoreRepository, private readonly sellerRepository: SellerRepository) { }

    async create(id: Identity, name: string, sellerId: Identity): Promise<void> {
        await this.ensureStoreIdNotExists(id)
        await this.ensureSellerIdExists(sellerId)

        const store = new Store({ id, name, sellerId })

        await this.storeRepository.save(store)
    }

    private async ensureStoreIdNotExists(id: Identity): Promise<void> {
        if (await this.storeRepository.exists(id)) {
            throw new InvalidArgumentError(`Existing Store with id ${id.value}`)
        }
    }

    private async ensureSellerIdExists(id: Identity): Promise<void> {
        if (!await this.sellerRepository.exists(id)) {
            throw new ModelNotFoundError(`Seller with id ${id.value} not found`)
        }
    }
}
