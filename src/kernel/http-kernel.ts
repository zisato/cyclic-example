import { Server } from 'http'
import { Configuration } from './container/configuration'
import { Container } from './container/container'
import { Kernel } from './kernel'

export interface HttpServer {
  boot: () => Promise<void>
  start: (port: number) => Promise<Server>
  stop: () => Promise<void>
}

export interface PreServerStart {
  loadMethods: (container: Container, configuration: Configuration) => PreServerStartMethod[]
}

export type PreServerStartMethod = () => Promise<void>

export abstract class HttpKernel extends Kernel {
  abstract httpServerBundleName (): string

  async startServer (): Promise<Server> {
    await this.boot()
    const bundleName = this.httpServerBundleName()
    const port = this.getPort(bundleName)
    const server = this.getServer(bundleName)

    return await server.start(port)
  }

  preServerStart (): Array<Promise<void>> {
    return []
  }

  private getPort (bundleName: string): number {
    const configuration = this.getConfiguration()
    if (!configuration.has(`${bundleName}.port`)) {
      throw new Error(`HttpKernel requires ${bundleName}.port in configuration`)
    }

    return configuration.get<number>(`${bundleName}.port`)
  }

  private getServer (bundleName: string): HttpServer {
    const container = this.getContainer()
    if (!container.has(`${bundleName}.server`)) {
      throw new Error(`HttpKernel requires ${bundleName}.server in container`)
    }

    return container.get<HttpServer>(`${bundleName}.server`)
  }
}
