import { Router } from 'express'
import { RouterConfiguration } from '../../src/simple-kernel/configuration/router-configuration'
import { Container } from '../../src/simple-kernel/container/container'
import { AdminRouterConfiguration } from '../routes/admin/admin-router-configuration'
import { PublicRouteLoader } from '../routes/public'
import { StoreRouteLoader } from '../routes/store'
import { ProductRouteLoader } from '../routes/product'
import { CartRouteLoader } from '../routes/cart'

export class AppRouterConfiguration implements RouterConfiguration {
    getRoutersConfiguration(container: Container): Router[] {
        return [
            ...(new AdminRouterConfiguration().getRoutersConfiguration(container)),
            ...(new PublicRouteLoader().getRoutersConfiguration(container)),
            ...(new StoreRouteLoader().getRoutersConfiguration(container)),
            ...(new ProductRouteLoader().getRoutersConfiguration(container)),
            ...(new CartRouteLoader().getRoutersConfiguration(container)),
        ]
    }
}
