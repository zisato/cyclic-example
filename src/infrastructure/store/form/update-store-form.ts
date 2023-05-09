import * as joi from 'joi'
import { Store } from '../../../domain/store/store'
import { AbstractForm } from '../../form/abstract-form'

type UpdateStoreFormData = {
    attributes: {
        name: string
    }
}

export class UpdateStoreForm extends AbstractForm<UpdateStoreFormData> {
    constructor(store: Store) {
        super()
        this.setData({
            attributes: {
                name: store.name
            }
        })
    }

    getValidationBodySchema(): joi.ObjectSchema<UpdateStoreFormData> {
        return joi.object({
            attributes: joi.object({
                name: joi.string()
            })
        })
    }
}
