import { User } from '../user'
import { UserRepository } from '../repository/user-repository'
import { InvalidArgumentError } from '../../error/invalid-argument-error'

export class CreateUserService {
    constructor (private readonly userRepository: UserRepository) {}

    async create (id: string, name: string): Promise<void> {
        await this.ensureUserIdNotExists(id)

        const user = new User(id, name)

        await this.userRepository.save(user)
    }

    private async ensureUserIdNotExists(id: string): Promise<void> {
        if (await this.userRepository.exists(id)) {
            throw new InvalidArgumentError(`Existing User with id ${id}`)
        }
    }
}
