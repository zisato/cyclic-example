import { v1 } from 'uuid'
import validate from 'uuid-validate'
import { Identity } from '../../domain/identity/identity'

export class UuidV1 implements Identity {
  readonly value

  constructor (value: string) {
    this.assertInvalidValue(value)

    this.value = value
  }

  static create (): Identity {
    return new UuidV1(v1())
  }

  equals(identity: Identity): boolean {
    return this.value === identity.value
  }

  private assertInvalidValue (id: string): void {
    if (!validate(id)) {
      throw new Error(`Invalid identity value: ${id}`)
    }
  }
}
