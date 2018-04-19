import { Validators } from '@angular/forms';
import { EntityMeta } from '../../../models/entity-meta.model';
import { Address } from '../../../models/address.model';
import { forceCapitalize, forceUppercase } from '../../../shared/dynamic-form/models/form-functions';
import { ArticlesBrwComponent } from '../articles/articles.brw';

export interface Organisation {
    id: string;
    meta: EntityMeta;
    address: Address;
    logo?: string; // asset
    packageSelection: boolean;
    currency: string;
    branches: string;
}

export const defaultTitle = 'Organisaties'
export const defaultTitleIcon = 'business'
export const defaultColDef = [
    {name: 'address.name',      header: 'Naam',       sort: true},
    {name: 'address.address',   header: 'Adres',      hideXs: true},
    {name: 'address.postcode',  header: 'Postcode',   hideXs: true},
    {name: 'address.city',      header: 'Woonplaats', sort: true},
    {name: 'employees',         header: 'Medewerkers', icon: 'person'},
  ]
export const defaultFormConfig = [
    {type: 'input', label: 'Naam',          name: 'address.name',         placeholder: 'Naam',          value: '', inputValueTransform: forceCapitalize, validation: [Validators.required, Validators.minLength(4)]},
    {type: 'selectchildren', label: 'Pakketselectie', name: 'packageSelection', placeholder: 'Pakketselectie', value: false, customSelectChildrenComponent: ArticlesBrwComponent},
    {type: 'input', label: 'Omschrijving',  name: 'address.description',  placeholder: 'Omschrijving',  value: ''},
    {type: 'input', label: 'Adres',         name: 'address.address',      placeholder: 'Adres',         value: '', inputValueTransform: forceCapitalize, validation: [Validators.required, Validators.minLength(4)]},
    {type: 'input', label: 'Postcode',      name: 'address.postcode',     placeholder: 'Postcode',      value: '', inputValueTransform: forceUppercase, validation: [Validators.required, Validators.minLength(6)]},
    {type: 'input', label: 'Plaats',        name: 'address.city',         placeholder: 'Plaats',        value: '', inputValueTransform: forceCapitalize, validation: [Validators.required]},
    {type: 'input', label: 'Telefoon',      name: 'address.telephone',    placeholder: 'Telefoon',      value: ''},
    {type: 'input', label: 'Web',           name: 'address.web',          placeholder: 'Web',           value: ''},
    {type: 'input', label: 'Email',         name: 'address.email',        placeholder: 'Email',         value: ''},
    {type: 'input', label: 'Contact',       name: 'address.contact',      placeholder: 'Contact',       value: '', validation: [Validators.required]},
    {type: 'input', label: 'Logo',          name: 'logo',                 placeholder: 'Logo',          value: ''},
    {type: 'input', label: 'Valuta',        name: 'currency',             placeholder: 'Valuta',        value: ''},
    {type: 'input', label: 'Filialen',      name: 'branches',             placeholder: 'Filialen',      value: ''}
  ]
