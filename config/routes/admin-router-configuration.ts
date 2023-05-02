import { Container } from '../../src/simple-kernel/container/container'
import { Router } from 'express'
import { CategoryRouteLoader } from './admin/category'
import { ProductRouteLoader } from './admin/product'
import { StoreRouteLoader } from './admin/store'
import { OrderRouteLoader } from './admin/order'
import { RouterConfiguration } from '../../src/simple-kernel/configuration/router-configuration'

export class AdminRouterConfiguration implements RouterConfiguration {
    getRoutersConfiguration(container: Container): Router[] {
        return [
            ...(new CategoryRouteLoader().getRoutersConfiguration(container)),
            ...(new ProductRouteLoader().getRoutersConfiguration(container)),
            ...(new StoreRouteLoader().getRoutersConfiguration(container)),
            ...(new OrderRouteLoader().getRoutersConfiguration(container))
        ]
    }
}
