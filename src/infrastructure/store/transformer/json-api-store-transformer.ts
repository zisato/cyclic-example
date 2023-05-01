import { Store } from '../../../domain/store/store'

type JsonApiStore = {
    id: string
    attributes: {
        name: string
    }
}

export class JsonApiStoreTransformer {
    static transform(store: Store): JsonApiStore {
        return {
            id: store.id.value,
            attributes: {
                name: store.name
            }
        }
    }
}
