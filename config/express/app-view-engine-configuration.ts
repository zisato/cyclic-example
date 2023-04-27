import { Parameters } from '../../src/simple-kernel/parameters/parameters'
import { ViewEngineConfiguration, ViewConfiguration } from '../../src/simple-kernel/configuration/view-configuration'
import { engine } from 'express-handlebars'

export class AppViewEngineConfiguration implements ViewConfiguration {
    getViewConfiguration(parameters: Parameters): ViewEngineConfiguration {
        return {
            viewEngine: 'hbs',
            views: parameters.get<string>('express.viewEngine.views'),
            render: {
                extension: 'hbs',
                fn: engine({
                    layoutsDir: parameters.get<string>('express.viewEngine.layoutsDir'),
                    defaultLayout: 'layout',
                    extname: '.hbs'
                })
            }
        }
    }
}
