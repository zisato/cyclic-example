import { aliasTo, asClass, AwilixContainer } from 'awilix'
import { Router } from 'express'
import { AdminRouteLoader } from '../config/routes/admin/admin-route-loader'
import { DemoRouteLoader } from '../config/routes/demo'
import { IndexRouteLoader } from '../config/routes/index'
import { ProductRouteLoader } from '../config/routes/product'
import { StatusRouteLoader } from '../config/routes/status'
import { StoreRouteLoader } from '../config/routes/store'
import { InvalidArgumentError } from './domain/error/invalid-argument-error'
import { ModelNotFoundError } from './domain/error/model-not-found-error'
import { InvalidJsonSchemaError } from './infrastructure/error/invalid-json-schema-error'
import AppErrorHandlerMiddleware from './infrastructure/express/middleware/app-error-handler-middleware'
import UserAuthenticatedMiddleware from './infrastructure/express/middleware/demo-user-authenticated-middleware'
import { AbstractBundle } from './kernel/bundle/abstract-bundle'
import { Bundle } from './kernel/bundle/bundle'
import { ExpressServerBundle, RouteLoader } from './kernel/bundles/express-server-bundle'
import { Configuration } from './kernel/container/configuration'
import { Container } from './kernel/container/container'
import { HttpKernel } from './kernel/http-kernel'

class AppRouteLoader implements RouteLoader {
    loadRoutes = (container: Container): Router[] => {
        return [
            ...(new AdminRouteLoader().loadRoutes(container)),
            ...(new IndexRouteLoader().loadRoutes(container)),
            ...(new StatusRouteLoader().loadRoutes(container)),
            ...(new DemoRouteLoader().loadRoutes(container)),
            ...(new StoreRouteLoader().loadRoutes(container)),
            ...(new ProductRouteLoader().loadRoutes(container))
        ]
    }
}

class AppBundle extends AbstractBundle {
    name(): string {
        return 'app'
    }

    loadContainer(containerBuilder: AwilixContainer<any>, _bundleConfiguration: Configuration): void {
        containerBuilder.register({
            productRepository: aliasTo('inMemoryProductRepository'),
            categoryRepository: aliasTo('inMemoryCategoryRepository'),
            storeRepository: aliasTo('inMemoryStoreRepository'),
            sellerRepository: aliasTo('inMemorySellerRepository'),
            userRepository: aliasTo('inMemoryUserRepository'),
            appErrorHandlerMiddleware: asClass(AppErrorHandlerMiddleware).inject(() => ({
                errorMapping: new Map<string, number>([
                    [InvalidArgumentError.name, 400],
                    [InvalidJsonSchemaError.name, 400],
                    [ModelNotFoundError.name, 404]
                ])
            })),
            userAuthenticatedMiddleware: asClass(UserAuthenticatedMiddleware)
        })
    }
}

export class App extends HttpKernel {
    httpServerBundleName(): string {
        return ExpressServerBundle.bundleName
    }

    registerBundles(): Bundle[] {
        return [
            new AppBundle(),
            new ExpressServerBundle(new AppRouteLoader())
        ]
    }
}