import { Validators } from '@angular/forms'
import { EntityMeta } from '../../../models/entity-meta.model'
import { forceCapitalize, forceUppercase } from '../../../shared/dynamic-form/models/form-functions'

export interface TripAddress {
    id: string
    meta: EntityMeta
    code: string
    name: string
    street: string
    house_nr: string
    house_nr_addition: string
    postcode: string
    city: string
}

export const defaultTitle = 'Trip Adressen'
export const defaultTitleIcon = 'trip_origin'
export const defaultColDef = [
    {name: 'code',  header: 'Code',     sort: true},
    {name: 'name',  header: 'Naam',     sort: true},
    {name: 'city',  header: 'Plaats',   sort: true},
  ]
export const defaultFormConfig = [
    {type: 'input', label: 'Code',          name: 'code',               placeholder: 'Code',        value: '', inputValueTransform: forceUppercase, validation: [Validators.required, Validators.minLength(3)]},
    {type: 'input', label: 'Naam',          name: 'name',               placeholder: 'Naam',        value: '', inputValueTransform: forceCapitalize, validation: [Validators.required, Validators.minLength(3)]},
    {type: 'input', label: 'Straat',        name: 'street',             placeholder: 'Straat',      value: '', inputValueTransform: forceCapitalize, validation: [Validators.required]},
    {type: 'input', label: 'Huisnummer',    name: 'house_nr',           placeholder: 'Huisnummer',  value: '', validation: [Validators.required]},
    {type: 'input', label: 'Toevoeging',    name: 'house_nr_addition',  placeholder: 'Toevoeging',  value: ''},
    {type: 'input', label: 'Postcode',      name: 'postcode',           placeholder: 'Postcode',    value: '', inputValueTransform: forceUppercase, validation: [Validators.required, Validators.minLength(6)]},
    {type: 'input', label: 'Plaats',        name: 'city',               placeholder: 'Plaats',      value: '', inputValueTransform: forceCapitalize, validation: [Validators.required]},
  ]
