export class CreateStoreCommand {
    constructor(public readonly id: string, public readonly name: string, public readonly sellerId: string) { }
}
