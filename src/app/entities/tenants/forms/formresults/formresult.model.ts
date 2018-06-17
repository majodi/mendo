import { Validators } from '@angular/forms'
import { EntityMeta } from '../../../../models/entity-meta.model'
import { forceUppercase } from '../../../../shared/dynamic-form/models/form-functions'

export interface FormResult {
    id: string
    meta: EntityMeta
    form: string
    formResult: any
}

export const defaultTitle = 'Formulierwaarden'
export const defaultTitleIcon = 'help_outline'
export const defaultColDef = []
export const defaultFormConfig = []

