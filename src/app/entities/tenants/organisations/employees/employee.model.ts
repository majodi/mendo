import { Validators } from '@angular/forms'
import { forceCapitalize, forceUppercase } from '../../../../shared/dynamic-form/models/form-functions'
import { EntityMeta } from '../../../../models/entity-meta.model'
import { Address } from '../../../../models/address.model'
import { SelectionField } from '../../../../shared/dynamic-form/models/selection-field.interface'

export interface Employee {
    id: string
    meta: EntityMeta
    organisation: string
    branch: string
    employeeNumber: number
    address: Address
    budget: number
    bugetYear: number
    spent: number
    propertiesAllowed: {}
    activitytags: {}
}

export const defaultTitle = 'Medewerkers'
export const defaultTitleIcon = 'person'
export const defaultColDef = [
    {name: 'address.name',      header: 'Naam',       sort: true},
    {name: 'address.address',   header: 'Adres',      hideXs: true},
    {name: 'address.postcode',  header: 'Postcode',   hideXs: true},
    {name: 'address.city',      header: 'Woonplaats', sort: true},
    {name: 'address.telephone', header: 'Telefoon', requiredModules: ['association']},
    {name: 'budget',            header: 'Budget',     sort: true, requiredModules: ['store']},
    {name: 'spent',             header: 'Verbruikt',  sort: true, requiredModules: ['store']},
    {
      name: 'left',
      header: 'Restant',
      format: (rec) => isNaN(rec['budget']) || isNaN(rec['spent']) ? '' : rec['budget'] - rec['spent'], fldStyleSelect: (rec) => !isNaN(rec['budget']) && !isNaN(rec['spent']) && rec['spent'] >= rec['budget'] ? {'color': 'red'} : {},
      sort: true,
      requiredModules: ['store']
    },
    {name: 'orderAs',           header: 'Bestel Namens', icon: 'shopping_cart', iconColorSelect: (rec) => !isNaN(rec['budget']) && !isNaN(rec['spent']) && rec['spent'] >= rec['budget'] ? 'warn' : 'primary', requiredModules: ['store']},
    {name: 'propertiesAllowed', header: 'Keuzes', icon: 'playlist_add_check', requiredModules: ['store']},
    {name: 'verificationCode',  header: 'Code', icon: 'verified_user', requiredModules: ['store']},
  ]
export const defaultFormConfig = [
    {
      type: 'pulldown',
      label: 'Organisatie',
      name: 'organisation',
      placeholder: 'Organisatie',
      value: '',
      customLookupFld: {path: 'organisations', tbl: 'organisation', fld: 'address.name'},
      customUpdateWithLookup: [{fld: 'branchChoices', lookupFld: 'branches'}, {fld: 'currency', lookupFld: 'currency'}]
    },
    {type: 'stringdisplay', label: 'Filiaalkeuzes', name: 'branchChoices',    placeholder: 'Filiaalkeuzes',    value: '', doNotPopulate: true},
    {type: 'select',    label: 'Filiaal/Afd.',      name: 'branch',           placeholder: 'Filiaal/Afd.',     value: '', options: []},
    {type: 'input',     label: 'Personeelsnummer',  name: 'employeeNumber',   placeholder: 'Personeelsnummer', value: ''},
    {type: 'input',     label: 'Naam',          name: 'address.name',         placeholder: 'Naam',          value: '', inputValueTransform: forceCapitalize, validation: [Validators.required]},
    {type: 'chiplist',  label: 'Activiteiten',  name: 'activitytags',         placeholder: 'Activiteiten',  value: '', options: 'SETTINGS:ACTIVITIES'},
    {type: 'input',     label: 'Functie',       name: 'address.description',  placeholder: 'Functie',       value: ''},
    {type: 'input',     label: 'Adres',         name: 'address.address',      placeholder: 'Adres',         value: '', inputValueTransform: forceCapitalize},
    {type: 'input',     label: 'Postcode',      name: 'address.postcode',     placeholder: 'Postcode',      value: '', inputValueTransform: forceUppercase},
    {type: 'input',     label: 'Plaats',        name: 'address.city',         placeholder: 'Plaats',        value: '', inputValueTransform: forceCapitalize},
    {type: 'input',     label: 'Telefoon',      name: 'address.telephone',    placeholder: 'Telefoon',      value: ''},
    {type: 'input',     label: 'Email',         name: 'address.email',        placeholder: 'Email',         value: ''},
    {type: 'stringdisplay', label: 'Valuta',    name: 'currency',             placeholder: 'Valuta',        value: '', requiredModules: ['store']},
    {type: 'input',     label: 'Budget',        name: 'budget',               placeholder: 'Budget',        value: '', requiredModules: ['store']}
  ]
// for selection button
export const defaultSelectionFields: SelectionField[] = [
  {name: 'activitytags'},
  {name: 'organisation', minimumLevel: 50},
]
