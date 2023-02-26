// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Typed<T> = {
  // eslint-disable-next-line @typescript-eslint/prefer-function-type
  new (...args: any[]): T
}

export interface Container {
  has: (id: string) => boolean
  get: <T>(id: string) => T
  hasTyped: <T = {}>(id: Typed<T>) => boolean
  getTyped: <T = {}>(id: Typed<T>) => T
}
