import { IndexRouteLoader } from "../config/routes";
import { Bundle } from "./kernel/bundle/bundle";
import { AxilixContainerBuilderConfigBundle } from "./kernel/bundles/awilix-container-builder-config-bundle";
import { ExpressServerBundle } from "./kernel/bundles/express-server-bundle";
import { HttpKernel } from "./kernel/http-kernel";

export class App extends HttpKernel {
    bundles(): Bundle[] {
        return [
            new AxilixContainerBuilderConfigBundle(),
            new ExpressServerBundle(new IndexRouteLoader())
        ]
    }

    httpServerBundleName (): string {
      return 'expressServer'
    }
}