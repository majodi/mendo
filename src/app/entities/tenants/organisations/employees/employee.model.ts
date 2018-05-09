import { Validators } from '@angular/forms';
import { forceCapitalize, forceUppercase } from '../../../../shared/dynamic-form/models/form-functions';
import { EntityMeta } from '../../../../models/entity-meta.model';
import { Address } from '../../../../models/address.model';

export interface Employee {
    id: string;
    meta: EntityMeta;
    organisation: string;
    address: Address;
    budget: number;
    bugetYear: number;
    spent: number;
    propertiesAllowed: {};
}

export const defaultTitle = 'Medewerkers'
export const defaultTitleIcon = 'person'
export const defaultColDef = [
    {name: 'address.name',      header: 'Naam',       sort: true},
    {name: 'address.address',   header: 'Adres',      hideXs: true},
    {name: 'address.postcode',  header: 'Postcode',   hideXs: true},
    {name: 'address.city',      header: 'Woonplaats', sort: true},
    {name: 'budget',            header: 'Budget',     sort: true},
    {name: 'spent',             header: 'Verbruikt',  sort: true},
    {name: 'orderAs',           header: 'Bestel Namens', icon: 'shopping_cart'},
    {name: 'propertiesAllowed', header: 'Keuzes', icon: 'playlist_add_check'},
    {name: 'verificationCode',  header: 'Code', icon: 'verified_user'},
  ]
export const defaultFormConfig = [
    {type: 'pulldown',  label: 'Organisatie',   name: 'organisation',         placeholder: 'Organisatie',   value: '', customLookupFld: {path: 'organisations', tbl: 'organisation', fld: 'address.name'}, customUpdateWithLookup: [{fld: 'branchChoices', lookupFld: 'branches'}, {fld: 'currency', lookupFld: 'currency'}]},
    {type: 'stringdisplay', label: 'Filiaalkeuzes', name: 'branchChoices', placeholder: 'Filiaalkeuzes',    value: '', doNotPopulate: true},
    {type: 'select',    label: 'Filiaal',       name: 'branch',               placeholder: 'Filiaal',       value: '', options: []},
    {type: 'input',     label: 'Naam',          name: 'address.name',         placeholder: 'Naam',          value: '', inputValueTransform: forceCapitalize, validation: [Validators.required, Validators.minLength(4)]},
    {type: 'input',     label: 'Functie',       name: 'address.description',  placeholder: 'Functie',       value: ''},
    {type: 'input',     label: 'Adres',         name: 'address.address',      placeholder: 'Adres',         value: '', inputValueTransform: forceCapitalize, validation: [Validators.required, Validators.minLength(4)]},
    {type: 'input',     label: 'Postcode',      name: 'address.postcode',     placeholder: 'Postcode',      value: '', inputValueTransform: forceUppercase, validation: [Validators.required, Validators.minLength(6)]},
    {type: 'input',     label: 'Plaats',        name: 'address.city',         placeholder: 'Plaats',        value: '', inputValueTransform: forceCapitalize, validation: [Validators.required]},
    {type: 'input',     label: 'Telefoon',      name: 'address.telephone',    placeholder: 'Telefoon',      value: ''},
    {type: 'input',     label: 'Email',         name: 'address.email',        placeholder: 'Email',         value: ''},
    {type: 'stringdisplay', label: 'Valuta',    name: 'currency',             placeholder: 'Valuta',        value: ''},
    {type: 'input',     label: 'Budget',        name: 'budget',               placeholder: 'Budget',        value: ''}
  ]
//for selection button
export const defaultSelectionFields = [
  {name: 'organisation'},
]


// {type: 'input', label: 'Web',           name: 'address.web',          placeholder: 'Web',           value: ''},
// {type: 'input', label: 'Logo',          name: 'logo',                 placeholder: 'Logo',          value: ''},