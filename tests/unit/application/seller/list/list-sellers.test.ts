import ListSellers from '../../../../../src/application/seller/list/list-sellers'
import { ListSellersQuery } from '../../../../../src/application/seller/list/list-sellers-query'
import { SellerRepository } from '../../../../../src/domain/seller/repository/seller-repository'
import { InterfaceMock } from '../../../../helpers/interface-mock'

describe('ListSellers unit test suite', () => {
    const stubs = {
        sellerRepository: {
            find: jest.fn()
        } as InterfaceMock<SellerRepository>
    }
    const listSellers = new ListSellers(stubs.sellerRepository)

    test('Should call sellerRepository.find once with arguments', async () => {
        const query = new ListSellersQuery()

        await listSellers.execute(query)

        const expectedTimes = 1
        expect(stubs.sellerRepository.find).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.sellerRepository.find).toHaveBeenCalledWith()
    })
})
