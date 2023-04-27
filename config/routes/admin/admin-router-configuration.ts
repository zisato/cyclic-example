import { Container } from '../../../src/simple-kernel/container/container'
import { Router } from 'express'
import { CategoryRouteLoader } from './category'
import { ProductRouteLoader } from './product'
import { StoreRouteLoader } from './store'
import { RouterConfiguration } from '../../../src/simple-kernel/configuration/router-configuration'

export class AdminRouterConfiguration implements RouterConfiguration {
    getRoutersConfiguration(container: Container): Router[] {
        return [
            ...(new CategoryRouteLoader().getRoutersConfiguration(container)),
            ...(new ProductRouteLoader().getRoutersConfiguration(container)),
            ...(new StoreRouteLoader().getRoutersConfiguration(container))
        ]
    }
}