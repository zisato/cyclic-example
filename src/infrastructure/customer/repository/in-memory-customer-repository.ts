import { Customer } from '../../../domain/customer/customer'
import { CustomerRepository } from '../../../domain/customer/repository/customer-repository'

export default class InMemoryCustomerRepository implements CustomerRepository {
    private readonly data: Customer[] = []

    async exists (id: string): Promise<boolean> {
        return this.data.some((customer: Customer): boolean => {
            return customer.getId() === id
        })
    }

    async save (customer: Customer): Promise<void> {
        const existingCustomerIndex = this.data.findIndex((data: Customer) => {
            return data.getId() === customer.getId()
        })

        if (existingCustomerIndex >= 0) {
            this.data[existingCustomerIndex] = customer
        } else {
            this.data.push(customer)
        }
    }
}
