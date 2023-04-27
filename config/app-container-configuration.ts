import { AwilixContainer, InjectionModeType, LifetimeType, aliasTo, asClass, asValue } from 'awilix'
import { Parameters } from '../src/simple-kernel/parameters/parameters'
import { ContainerConfiguration } from '../src/simple-kernel/configuration/container-configuration'
import CyclicDB from '@cyclic.sh/dynamodb'
import AdminListProductsController from '../src/infrastructure/product/controller/admin/list-products-controller'
import ListProductsController from '../src/infrastructure/product/controller/list-products-controller'
import AppErrorHandlerMiddleware from '../src/infrastructure/express/middleware/app-error-handler-middleware'
import { InvalidArgumentError } from '../src/domain/error/invalid-argument-error'
import { ModelNotFoundError } from '../src/domain/error/model-not-found-error'
import { InvalidJsonSchemaError } from '../src/infrastructure/error/invalid-json-schema-error'

export class AppContainerConfiguration implements ContainerConfiguration {
    configureContainer(container: AwilixContainer, parameters: Parameters): void {
        container.options.injectionMode = parameters.get<InjectionModeType>('container.injectionMode')
        container.loadModules(parameters.get<string[]>('container.loadModules.patterns'), {
            formatName: 'camelCase',
            resolverOptions: {
                lifetime: parameters.get<LifetimeType>('container.loadModules.lifetime'),
                injectionMode: parameters.get<InjectionModeType>('container.loadModules.injectionMode')
            }
        })

        container.register({
            cyclicDB: asValue(CyclicDB('long-lime-whale-garbCyclicDB')),
            adminListProductsController: asClass(AdminListProductsController),
            listProductsController: asClass(ListProductsController),
            productRepository: aliasTo('inMemoryProductRepository'),
            categoryRepository: aliasTo('inMemoryCategoryRepository'),
            storeRepository: aliasTo('inMemoryStoreRepository'),
            orderRepository: aliasTo('inMemoryOrderRepository'),
            // sellerRepository: aliasTo('dynamodbSellerRepository'),
            sellerRepository: aliasTo('inMemorySellerRepository'),
            customerRepository: aliasTo('inMemoryCustomerRepository'),
            appErrorHandlerMiddleware: asClass(AppErrorHandlerMiddleware).inject(() => ({
                errorMapping: new Map<string, number>([
                    [InvalidArgumentError.name, 400],
                    [InvalidJsonSchemaError.name, 400],
                    [ModelNotFoundError.name, 404]
                ])
            })),
            // userAuthenticatedMiddleware: asClass(UserAuthenticatedMiddleware)
        })
    }
}
