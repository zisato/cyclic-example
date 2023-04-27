import { Customer } from '../customer'
import { CustomerRepository } from '../repository/customer-repository'
import { InvalidArgumentError } from '../../error/invalid-argument-error'
import { Identity } from '../../identity/identity'

export class CreateCustomerService {
    constructor (private readonly customerRepository: CustomerRepository) {}

    async create (id: Identity, name: string): Promise<void> {
        await this.ensureCustomerIdNotExists(id)

        const customer = new Customer({ id, name })

        await this.customerRepository.save(customer)
    }

    private async ensureCustomerIdNotExists(id: Identity): Promise<void> {
        if (await this.customerRepository.exists(id)) {
            throw new InvalidArgumentError(`Existing Customer with id ${id.value}`)
        }
    }
}
