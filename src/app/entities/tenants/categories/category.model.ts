import { Validators } from '@angular/forms';
import { EntityMeta } from '../../../models/entity-meta.model';
import { forceUppercase } from '../../../shared/dynamic-form/models/form-functions';

export interface Category {
    id: string;
    meta: EntityMeta;
    code: string;
    description: string;
    image: string; // image
    measurements: string; // property
    // measurements_v: string; // virtual
    colors: string; // property
    // colors_v: string // virtual
    parentCategory: string;
    priority: string;
}

export const defaultTitle = 'Categorieën'
export const defaultTitleIcon = 'more'
export const defaultColDef = [
    {name: 'code',        header: 'Code', sort: true},
    {name: 'description', header: 'Omschrijving'},
  ]
export const defaultFormConfig = [
    {type: 'input',       label: 'Code',              name: 'code',           placeholder: 'Code',              value: '', inputValueTransform: forceUppercase, validation: [Validators.required, Validators.minLength(4)]},
    {type: 'input',       label: 'Omschrijving',      name: 'description',    placeholder: 'Omschrijving',      value: '', validation: [Validators.required]},
    {type: 'lookup',      label: 'Afbeelding',        name: 'image',          placeholder: 'Afbeelding',        value: '', inputValueTransform: forceUppercase, customLookupFld: {path: 'images', tbl: 'image', fld: 'code'}, customUpdateWithLookup: [{fld: 'imagedisplay', lookupFld: 'name'}]},
    {type: 'imagedisplay',label: 'Afbeelding',        name: 'imagedisplay',   placeholder: 'Afbeelding',        value: '', imageStyle: {'width': '30%'}},
    {type: 'pulldown',    label: 'Std. Maten',        name: 'measurements',   placeholder: 'Std. Maten',        value: '', customLookupFld: {path: 'properties', tbl: 'property', fld: 'code'}},
    {type: 'pulldown',    label: 'Std. Kleuren',      name: 'colors',         placeholder: 'Std. Kleuren',      value: '', customLookupFld: {path: 'properties', tbl: 'property', fld: 'code'}},
    {type: 'pulldown',    label: 'Subcategorie van',  name: 'parentCategory', placeholder: 'Subcategorie van',  value: '', customLookupFld: {path: 'categories', tbl: 'category', fld: 'code'}},
    {type: 'input',       label: 'Prioriteit',        name: 'priority',       placeholder: 'Prioriteit',        value: ''},
  ]

