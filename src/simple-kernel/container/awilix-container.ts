import { AwilixContainer as AwilixContainerBase } from 'awilix'
import { Container, Typed } from './container'

interface DisposableContainer {
  dispose(): void
}

export class AwilixContainer implements Container, DisposableContainer {
  constructor (private readonly container: AwilixContainerBase) {}

  has (id: string): boolean {
    return this.container.hasRegistration(id)
  }

  get <T>(id: string): T {
    return this.container.resolve<T>(id)
  }

  hasTyped <T>(id: Typed<T>): boolean {
    const idName = id.name
    const parsedId = idName.charAt(0).toLowerCase() + idName.slice(1)

    return this.container.hasRegistration(parsedId)
  }

  getTyped <T>(id: Typed<T>): T {
    const idName = id.name
    const parsedId = idName.charAt(0).toLowerCase() + idName.slice(1)

    return this.container.resolve<T>(parsedId)
  }

  dispose(): void {
    this.container.dispose()
  }
}
