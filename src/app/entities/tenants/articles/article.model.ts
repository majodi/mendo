import { Validators } from '@angular/forms';
import { EntityMeta } from "../../../models/entity-meta.model";
import { forceUppercase } from '../../../shared/dynamic-form/models/form-functions';

export interface Article {
    id: string;
    meta: EntityMeta;
    code: string;
    description_s: string;
    description_l: string;
    category: string; // category
    category_v: string; // virtual category code
    image: string; // asset
    measurements: string; // property
    measurements_v: string; // virtual property code
    colors: string; // property
    colors_v: string; // virtual property code
    price: number;
    unit: string;
}

export const defaultTitle = 'Artikelen'
export const defaultTitleIcon = 'label outline'
export const defaultColDef = [
    {name: 'code',            header: 'Code', sort: true},
    {name: 'description_s',   header: 'Omschrijving kort', hideXs: true},
    {name: 'category_v',      header: 'Categorie', hideXs: true},
    {name: 'image',           header: 'Afbeelding'},
    {name: 'price',           header: 'Prijs'},
    {name: 'unit',            header: 'Maatvoering'},
  ]
export const defaultFormConfig = [
    {type: 'input',    label: 'Code',              name: 'code',          placeholder: 'Code',              value: '', inputValueTransform: forceUppercase, validation: [Validators.required, Validators.minLength(4)]},
    {type: 'input',    label: 'Omschrijving kort', name: 'description_s', placeholder: 'Omschrijving kort', value: '', validation: [Validators.required, Validators.minLength(4)]},
    {type: 'input',    label: 'Omschrijving lang', name: 'description_l', placeholder: 'Omschrijving lang', value: ''},
    {type: 'pulldown', label: 'Categorie',         name: 'category',      placeholder: 'Categorie',         value: '', customLookupFld: {path: 'categories', tbl: 'category', fld: 'code'}},
    {type: 'input',    label: 'Afbeelding',        name: 'image',         placeholder: 'Afbeelding',        value: ''},
    {type: 'pulldown', label: 'Maten',             name: 'measurements',  placeholder: 'Maten',             value: '', customLookupFld: {path: 'properties', tbl: 'property', fld: 'code'}},
    {type: 'pulldown', label: 'Kleuren',           name: 'colors',        placeholder: 'Kleuren',           value: '', customLookupFld: {path: 'properties', tbl: 'property', fld: 'code'}},
    {type: 'input',    label: 'Prijs',             name: 'price',         placeholder: 'Prijs',             value: '', validation: [Validators.required]},
    {type: 'input',    label: 'Maatvoering',       name: 'unit',          placeholder: 'Maatvoering',       value: '', validation: [Validators.required]},
  ]
export const defaultSelectionFields = [
  {name: 'category'},
  // {name: 'measurements'},
  // {name: 'colors'},
]
