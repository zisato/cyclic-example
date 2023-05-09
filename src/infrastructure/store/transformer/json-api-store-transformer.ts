import { Store } from '../../../domain/store/store'

type JsonApiStore = {
    id: string
    attributes: {
        name: string
    }
}

export default class JsonApiStoreTransformer {
    transformArray(stores: Store[]): JsonApiStore[] {
        return stores.map((store: Store) => {
            return this.transform(store)
        })
    }

    transform(store: Store): JsonApiStore {
        return {
            id: store.id.value,
            attributes: {
                name: store.name
            }
        }
    }
}
