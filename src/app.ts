import { asClass, AwilixContainer } from "awilix";
import { Router } from "express";
import { IndexRouteLoader } from "../config/routes/index";
import { StatusRouteLoader } from "../config/routes/status";
import { InvalidArgumentError } from "./domain/error/invalid-argument-error";
import { InvalidJsonSchemaError } from "./infrastructure/error/invalid-json-schema-error";
import AppErrorHandlerMiddleware from "./infrastructure/express/middleware/app-error-handler-middleware";
import { AbstractBundle } from "./kernel/bundle/abstract-bundle";
import { Bundle } from "./kernel/bundle/bundle";
import { ExpressServerBundle, RouteLoader } from "./kernel/bundles/express-server-bundle";
import { Configuration } from "./kernel/container/configuration";
import { Container } from "./kernel/container/container";
import { HttpKernel } from "./kernel/http-kernel";

class AppRouteLoader implements RouteLoader {
    loadRoutes = (container: Container): Router[] => {
        return [
            ...(new IndexRouteLoader().loadRoutes(container)),
            ...(new StatusRouteLoader().loadRoutes(container)),
        ]
    }
}

class AppBundle extends AbstractBundle {
    name(): string {
        return 'app'
    }

    loadContainer(containerBuilder: AwilixContainer<any>, _bundleConfiguration: Configuration): void {
        containerBuilder.register({
            appErrorHandlerMiddleware: asClass(AppErrorHandlerMiddleware).inject(() => ({
                errorMapping: new Map<string, number>([
                    [InvalidArgumentError.name, 400],
                    [InvalidJsonSchemaError.name, 400]
                ])
            }))
        })
    }
}

export class App extends HttpKernel {
    registerBundles(): Bundle[] {
        return [
            new AppBundle(),
            new ExpressServerBundle(new AppRouteLoader())
        ]
    }

    httpServerBundleName (): string {
      return 'expressServer'
    }
}