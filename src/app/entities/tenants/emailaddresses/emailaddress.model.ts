import { Validators } from '@angular/forms'
import { EntityMeta } from '../../../models/entity-meta.model'
import { forceUppercase } from '../../../shared/dynamic-form/models/form-functions'

export interface EmailAddress {
    id: string
    meta: EntityMeta
    firstName: string
    lastName: string
    prefix: string
}

export const defaultTitle = 'Email adressen'
export const defaultTitleIcon = 'email'
export const defaultColDef = [
    {name: 'id',        header: 'Email', sort: true},
    {name: 'firstName', header: 'Voornaam', format: rec => `"${rec['firstName']}"`, sort: true},
    {name: 'prefix',    header: 'Tussenvoegsel', format: rec => `"${rec['prefix']}"`, hideXs: true},
    {name: 'lastName',  header: 'Achternaam', format: rec => `"${rec['lastName']}"`, sort: true},
  ]
export const defaultFormConfig = [
    {type: 'stringdisplay', label: 'Voornaam',      name: 'firstName',  placeholder: 'Voornaam',      value: '', },
    {type: 'stringdisplay', label: 'Tussenvoegsel', name: 'prefix',     placeholder: 'Tussenvoegsel', value: '', },
    {type: 'stringdisplay', label: 'Achternaam',    name: 'lastName',   placeholder: 'Achternaam',    value: '', },
  ]

