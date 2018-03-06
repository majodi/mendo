import { Validators } from '@angular/forms';
import { forceCapitalize, forceUppercase } from '../../../../shared/dynamic-form/models/form-functions';
import { EntityMeta } from '../../../../models/entity-meta.model';
import { Address } from '../../../../models/address.model';

export interface Employee {
    id: string;
    meta: EntityMeta;
    organisation: string;
    address: Address;
}

export const defaultTitle = 'Medewerkers'
export const defaultTitleIcon = 'person'
export const defaultColDef = [
    {name: 'address.name',      header: 'Naam',       sort: true},
    {name: 'address.address',   header: 'Adres',      hideXs: true},
    {name: 'address.postcode',  header: 'Postcode',   hideXs: true},
    {name: 'address.city',      header: 'Woonplaats', sort: true}
  ]
export const defaultFormConfig = [
    {type: 'pulldown', label: 'Organisatie', name: 'organisation',        placeholder: 'Organisatie',   value: '', customLookupFld: {path: 'organisations', tbl: 'organisation', fld: 'address.name'}},
    {type: 'input', label: 'Naam',          name: 'address.name',         placeholder: 'Naam',          value: '', inputValueTransform: forceCapitalize, validation: [Validators.required, Validators.minLength(4)]},
    {type: 'input', label: 'Omschrijving',  name: 'address.description',  placeholder: 'Omschrijving',  value: ''},
    {type: 'input', label: 'Adres',         name: 'address.address',      placeholder: 'Adres',         value: '', inputValueTransform: forceCapitalize, validation: [Validators.required, Validators.minLength(4)]},
    {type: 'input', label: 'Postcode',      name: 'address.postcode',     placeholder: 'Postcode',      value: '', inputValueTransform: forceUppercase, validation: [Validators.required, Validators.minLength(6)]},
    {type: 'input', label: 'Plaats',        name: 'address.city',         placeholder: 'Plaats',        value: '', inputValueTransform: forceCapitalize, validation: [Validators.required]},
    {type: 'input', label: 'Telefoon',      name: 'address.telephone',    placeholder: 'Telefoon',      value: ''},
    {type: 'input', label: 'Web',           name: 'address.web',          placeholder: 'Web',           value: ''},
    {type: 'input', label: 'Email',         name: 'address.email',        placeholder: 'Email',         value: ''},
    {type: 'input', label: 'Logo',          name: 'logo',                 placeholder: 'Logo',          value: ''}
  ]
//for selection button
export const defaultSelectionFields = [
  {name: 'organisation'},
]

//     {type: 'input', label: 'Contact',       name: 'address.contact',      placeholder: 'Contact',       value: '', validation: [Validators.required]},
