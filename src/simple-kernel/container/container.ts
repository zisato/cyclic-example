export type Typed<T> = {
  new (...args: any[]): T
}

export interface Container {
  has: (id: string) => boolean
  get: <T>(id: string) => T
  hasTyped: <T = {}>(id: Typed<T>) => boolean
  getTyped: <T = {}>(id: Typed<T>) => T
}
