import { Customer } from '../../../domain/customer/customer'
import { CustomerRepository } from '../../../domain/customer/repository/customer-repository'
import { Identity } from '../../../domain/identity/identity'

export default class InMemoryCustomerRepository implements CustomerRepository {
    private readonly data: Customer[] = []

    async exists (id: Identity): Promise<boolean> {
        return this.data.some((customer: Customer): boolean => {
            return customer.id.equals(id)
        })
    }

    async save (customer: Customer): Promise<void> {
        const existingCustomerIndex = this.data.findIndex((data: Customer) => {
            return data.id.equals(customer.id)
        })

        if (existingCustomerIndex >= 0) {
            this.data[existingCustomerIndex] = customer
        } else {
            this.data.push(customer)
        }
    }
}
