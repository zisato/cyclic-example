import { Parameters } from '../parameters/parameters'

type ViewEngineRenderFunction = (path: string, options: object, callback: (e: any, rendered?: string) => void) => void

export type ViewEngineConfiguration = {
    viewEngine: string
    views: string
    render?: {
        extension: string
        fn: ViewEngineRenderFunction
    }
}

export interface ViewConfiguration {
    getViewConfiguration(parameters: Parameters): ViewEngineConfiguration | undefined
}
