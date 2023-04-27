import { Identity } from '../../identity/identity'
import { Customer } from '../customer'

export interface CustomerRepository {
    exists: (id: Identity) => Promise<boolean>
    save: (customer: Customer) => Promise<void>
}