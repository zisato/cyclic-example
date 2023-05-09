export class File {
    readonly name: string
    readonly mimeType: string
    readonly size: number
    readonly data: Buffer

    constructor({ name, mimeType, size, data }: { name: string, mimeType: string, size: number, data: Buffer }) {
        this.name = name
        this.mimeType = mimeType
        this.size = size
        this.data = data
    }

    asDataUrl(): string {
        return `data:${this.mimeType};base64, ${this.data.toString('base64')}`
    }
}
