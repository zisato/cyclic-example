import { Customer } from '../customer'

export interface CustomerRepository {
    exists: (id: string) => Promise<boolean>
    save: (customer: Customer) => Promise<void>
}