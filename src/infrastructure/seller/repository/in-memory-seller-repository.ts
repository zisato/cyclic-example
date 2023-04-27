import { Seller } from '../../../domain/seller/seller'
import { SellerRepository } from '../../../domain/seller/repository/seller-repository'

export default class InMemorySellerRepository implements SellerRepository {
    private readonly data: Seller[] = []
    
    async find(): Promise<Seller[]> {
        return this.data
    }

    async exists (id: string): Promise<boolean> {
        return this.data.some((seller: Seller): boolean => {
            return seller.id  === id
        })
    }

    async save (seller: Seller): Promise<void> {
        const existingSellerIndex = this.data.findIndex((data: Seller) => {
            return data.id === seller.id
        })

        if (existingSellerIndex >= 0) {
            this.data[existingSellerIndex] = seller
        } else {
            this.data.push(seller)
        }
    }
}
