export interface Identity {
  readonly value: string

  equals(identity: Identity): boolean
}
