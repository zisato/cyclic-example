import { Seller } from '../seller'
import { SellerRepository } from '../repository/seller-repository'
import { InvalidArgumentError } from '../../error/invalid-argument-error'

export class CreateSellerService {
    constructor(private readonly sellerRepository: SellerRepository) { }

    async create(id: string, name: string): Promise<void> {
        await this.ensureSellerIdNotExists(id)

        const seller = new Seller({ id, name })

        await this.sellerRepository.save(seller)
    }

    private async ensureSellerIdNotExists(id: string): Promise<void> {
        if (await this.sellerRepository.exists(id)) {
            throw new InvalidArgumentError(`Existing Seller with id ${id}`)
        }
    }
}
