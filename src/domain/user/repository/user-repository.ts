import { User } from '../user'

export interface UserRepository {
    exists: (id: string) => Promise<boolean>
    save: (user: User) => Promise<void>
}