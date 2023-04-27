export interface Parameters {
    has(name: string): boolean

    get<T>(name: string): T
}
