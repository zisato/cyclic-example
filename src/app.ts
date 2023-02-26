import { Router } from "express";
import { IndexRouteLoader } from "../config/routes";
import { StatusRouteLoader } from "../config/routes/status";
import { Bundle } from "./kernel/bundle/bundle";
import { AxilixContainerBuilderConfigBundle } from "./kernel/bundles/awilix-container-builder-config-bundle";
import { ExpressServerBundle, RouteLoader } from "./kernel/bundles/express-server-bundle";
import { Container } from "./kernel/container/container";
import { HttpKernel } from "./kernel/http-kernel";

class AppRouteLoader implements RouteLoader {
    loadRoutes = (container: Container): Router[] => {
        return [
            ...(new IndexRouteLoader().loadRoutes(container)),
            ...(new StatusRouteLoader().loadRoutes(container))
        ]
    }
}

export class App extends HttpKernel {
    bundles(): Bundle[] {
        return [
            new AxilixContainerBuilderConfigBundle(),
            new ExpressServerBundle(new AppRouteLoader())
        ]
    }

    httpServerBundleName (): string {
      return 'expressServer'
    }
}