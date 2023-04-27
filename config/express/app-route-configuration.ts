import { Router } from 'express'
import { RouterConfiguration } from '../../src/simple-kernel/configuration/router-configuration'
import { Container } from '../../src/simple-kernel/container/container'
import { AdminRouterConfiguration } from '../routes/admin-router-configuration'
import { AppPublicRouterConfiguration } from '../routes/public-router-configuration'

export class AppRouterConfiguration implements RouterConfiguration {
    getRoutersConfiguration(container: Container): Router[] {
        return [
            ...(new AdminRouterConfiguration().getRoutersConfiguration(container)),
            ...(new AppPublicRouterConfiguration().getRoutersConfiguration(container))
        ]
    }
}
