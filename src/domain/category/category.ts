export class Category {
    readonly id
    readonly name

    constructor({ id, name }: { id: string, name: string }) {
        this.id = id
        this.name = name
    }
}
