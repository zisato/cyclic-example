import config, { IConfig } from 'config'
import { Parameters } from './parameters'

export class NodeConfigParameters implements Parameters {
    private config: IConfig

    constructor() {
        this.config = config.util.extendDeep(config, { environment: config.util.getEnv('NODE_ENV') })
    }

    has(name: string): boolean {
        return this.config.has(name)
    }

    get<T>(name: string): T {
        if (!this.has(name)) {
            throw new Error(`parameter with name ${name} not exists`)
        }

        return this.config.get<T>(name)
    }
}
