export interface Configuration {
  has: (name: string) => boolean
  get: <T>(name: string) => T
}
