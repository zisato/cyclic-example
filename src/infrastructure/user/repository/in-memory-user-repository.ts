import { User } from '../../../domain/user/user'
import { UserRepository } from '../../../domain/user/repository/user-repository'

export default class InMemoryUserRepository implements UserRepository {
    private readonly data: User[] = []

    async exists (id: string): Promise<boolean> {
        return this.data.some((user: User): boolean => {
            return user.getId() === id
        })
    }

    async save (user: User): Promise<void> {
        const existingUserIndex = this.data.findIndex((data: User) => {
            return data.getId() === user.getId()
        })

        if (existingUserIndex >= 0) {
            this.data[existingUserIndex] = user
        } else {
            this.data.push(user)
        }
    }
}
