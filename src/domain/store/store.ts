export class Store {
    constructor (private _id: string, private _name: string) {}

    get id (): string {
        return this._id
    }

    get name (): string {
        return this._name
    }
    
    set name (newName: string) {
        this._name = newName
    }
}