import { Server } from 'http'
import { Bundle } from './bundle/bundle'
import { Configuration } from './container/configuration'
import { Container } from './container/container'
import { HttpKernelError } from './exception/http-kernel-error'
import { Kernel } from './kernel'

export interface HttpServer {
  start: (port: number) => Promise<Server>
  stop: () => Promise<void>
}

export interface PreServerStart {
  loadMethods: (container: Container, configuration: Configuration) => PreServerStartMethod[]
}

export type PreServerStartMethod = () => Promise<void>

export abstract class HttpKernel extends Kernel {
  abstract httpServerBundleName (): string

  async boot(): Promise<void> {
    const bundles = this.registerBundles()

    const existsHttpServerBundle = bundles.some((bundle: Bundle) => {
      return bundle.name() === this.httpServerBundleName()
    })

    if (existsHttpServerBundle === false) {
      throw new HttpKernelError('HttpServerBundleName not registered as bundle.')
    }

    await super.boot()
  }

  async startServer (): Promise<Server> {
    await this.boot()

    const port = this.getPort(this.httpServerBundleName())
    const server = this.getServer(this.httpServerBundleName())

    return await server.start(port)
  }

  private getPort (bundleName: string): number {
    const configuration = this.getConfiguration()
    if (!configuration.has(`${bundleName}.port`)) {
      throw new HttpKernelError(`HttpKernel requires ${bundleName}.port in configuration`)
    }

    return configuration.get<number>(`${bundleName}.port`)
  }

  private getServer (bundleName: string): HttpServer {
    const container = this.getContainer()
    if (!container.has(`${bundleName}.server`)) {
      throw new HttpKernelError(`HttpKernel requires ${bundleName}.server in container`)
    }

    return container.get<HttpServer>(`${bundleName}.server`)
  }
}
