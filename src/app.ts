import { SimpleKernel} from './simple-kernel/simple-kernel'
import { AppContainerConfiguration } from '../config/app-container-configuration'
import { AppErrorHandlerConfiguration } from '../config/express/app-error-handler-configuration'
import { AppMiddlewareConfiguration } from '../config/express/app-middleware-configuration'
import { AppRouterConfiguration } from '../config/express/app-route-configuration'
import { AppViewEngineConfiguration } from '../config/express/app-view-engine-configuration'

export class App extends SimpleKernel {
    constructor() {
        super({
            containerConfiguration: new AppContainerConfiguration(),
            middlewareConfiguration: new AppMiddlewareConfiguration(),
            routerConfiguration: new AppRouterConfiguration(),
            errorHandlerConfiguration: new AppErrorHandlerConfiguration(),
            viewConfiguration: new AppViewEngineConfiguration()
        })
    }
}
