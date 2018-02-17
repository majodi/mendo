import { Validators } from '@angular/forms';
import { EntityMeta } from "../../models/entity-meta.model";
import { Address } from "../../models/address.model";

export interface Tenant {
    id?: string;
    meta: EntityMeta;
    address: Address;
    banner?: string; // asset
    logo?: string; // asset
    order_count?: number
}

export const defaultEntityPath = 'tenants'
export const defaultTitle = 'Tenants'
export const defaultTitleIcon = 'store'
export const defaultColDef = [
    {name: 'address.name',      header: 'Naam',       sort: true},
    {name: 'address.address',   header: 'Adres',      hideXs: true},
    {name: 'address.postcode',  header: 'Postcode',   hideXs: true},
    {name: 'address.city',      header: 'Woonplaats', sort: true}
  ]
export const defaultFormConfig = [
    {type: 'input', label: 'Naam',          name: 'address.name',         placeholder: 'Naam',          value: '', validation: [Validators.required, Validators.minLength(4)]},
    {type: 'input', label: 'Omschrijving',  name: 'address.description',  placeholder: 'Omschrijving',  value: ''},
    {type: 'input', label: 'Adres',         name: 'address.address',      placeholder: 'Adres',         value: '', validation: [Validators.required, Validators.minLength(4)]},
    {type: 'input', label: 'Postcode',      name: 'address.postcode',     placeholder: 'Postcode',      value: '', validation: [Validators.required, Validators.minLength(6)]},
    {type: 'input', label: 'Plaats',        name: 'address.city',         placeholder: 'Plaats',        value: '', validation: [Validators.required]},
    {type: 'input', label: 'Telefoon',      name: 'address.telephone',    placeholder: 'Telefoon',      value: ''},
    {type: 'input', label: 'Web',           name: 'address.web',          placeholder: 'Web',           value: ''},
    {type: 'input', label: 'Email',         name: 'address.email',        placeholder: 'Email',         value: ''},
    {type: 'input', label: 'Contact',       name: 'address.contact',      placeholder: 'Contact',       value: '', validation: [Validators.required]},
    {type: 'input', label: 'Banner',        name: 'banner',               placeholder: 'Banner',        value: ''},
    {type: 'input', label: 'Logo',          name: 'logo',                 placeholder: 'Logo',          value: ''}
  ]

