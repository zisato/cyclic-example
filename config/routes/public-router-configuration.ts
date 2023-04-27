import { Container } from '../../src/simple-kernel/container/container'
import { Router } from 'express'
import { RouterConfiguration } from '../../src/simple-kernel/configuration/router-configuration'
import { CartRouterConfiguration } from './public/cart'
import { CommonRouterConfiguration } from './public/common'
import { ProductRouterConfiguration } from './public/product'
import { SellerRouterConfiguration } from './public/seller'
import { StoreRouterConfiguration } from './public/store'

export class AppPublicRouterConfiguration implements RouterConfiguration {
    getRoutersConfiguration(container: Container): Router[] {
        return [
            ...(new CartRouterConfiguration().getRoutersConfiguration(container)),
            ...(new CommonRouterConfiguration().getRoutersConfiguration(container)),
            ...(new ProductRouterConfiguration().getRoutersConfiguration(container)),
            ...(new SellerRouterConfiguration().getRoutersConfiguration(container)),
            ...(new StoreRouterConfiguration().getRoutersConfiguration(container))
        ]
    }
}
