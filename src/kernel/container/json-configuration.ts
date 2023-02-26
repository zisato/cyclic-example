import { Configuration } from './configuration'

type JsonValue = string | number | boolean | null | JsonValue[] | Json
export interface Json { [key: string]: JsonValue }

export class JsonConfiguration implements Configuration {
  constructor (private readonly config: Json) {}

  has (name: string): boolean {
    return this.dotNotationToObject(name, this.config) !== undefined
  }

  get <T>(name: string): T {
    return this.dotNotationToObject(name, this.config) as T
  }

  private dotNotationToObject (dotString: string, value: any): any {
    return dotString.split('.').reduce(function (a, b) {
      return (a !== undefined) ? a[b] : a
    }, value)
  }
}
