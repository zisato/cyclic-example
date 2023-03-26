import { StoreRepository } from "../../../domain/store/repository/store-repository";
import { UpdateStoreCommand } from "./update-store-command";

export default class UpdateStore {
    constructor (private readonly storeRepository: StoreRepository) {}

    async execute (command: UpdateStoreCommand): Promise<void> {
        const store = await this.storeRepository.get(command.id)

        store.name = command.name

        this.storeRepository.save(store)
    }
}
