import { Store } from "../../../domain/store/store";
import { StoreRepository } from "../../../domain/store/repository/store-repository";
import { InvalidArgumentError } from "../../../domain/error/invalid-argument-error";
import { CreateStoreCommand } from "./create-store-command";

export default class CreateStore {
    constructor (private readonly storeRepository: StoreRepository) {}

    async execute (command: CreateStoreCommand): Promise<void> {
        await this.ensureStoreIdNotExists(command.id)

        const store = new Store(command.id, command.name)

        this.storeRepository.save(store)
    }

    async ensureStoreIdNotExists(id: string): Promise<void> {
        if (await this.storeRepository.exists(id)) {
            throw new InvalidArgumentError(`Existing Store with id ${id}`)
        }
    }
}
