import { Validators } from '@angular/forms'
import { EntityMeta } from '../../../models/entity-meta.model'
import { forceUppercase } from '../../../shared/dynamic-form/models/form-functions'

export interface Vehicle {
    id: string
    meta: EntityMeta
    code: string
    description: string
}

export const defaultTitle = 'Voertuigen'
export const defaultTitleIcon = 'directions_car'
export const defaultColDef = [
    {name: 'code',          header: 'Kenteken', sort: true},
    {name: 'description',   header: 'Omschrijving'},
  ]
export const defaultFormConfig = [
    {type: 'input', label: 'Kenteken',      name: 'code',           placeholder: 'Kenteken',        value: '', inputValueTransform: forceUppercase, validation: [Validators.required, Validators.minLength(4)]},
    {type: 'input', label: 'Omschrijving',  name: 'description',    placeholder: 'Omschrijving',    value: '', validation: [Validators.required]},
  ]

