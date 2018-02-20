import { Validators } from '@angular/forms';
import { EntityMeta } from '../../../models/entity-meta.model';
import { forceUppercase } from '../../../shared/dynamic-form/models/form-functions';

export interface Category {
    id: string;
    meta: EntityMeta;
    code: string;
    description: string;
    measurements: string; // property
    measurements_v: string; // virtual
    colors: string; // property
    colors_v: string // virtual
}

export const defaultTitle = 'Categorieën'
export const defaultTitleIcon = 'more'
export const defaultColDef = [
    {name: 'code',        header: 'Code', sort: true},
    {name: 'description', header: 'Omschrijving'},
  ]
export const defaultFormConfig = [
    {type: 'input',     label: 'Code',          name: 'code',         placeholder: 'Code',          value: '', inputValueTransform: forceUppercase, validation: [Validators.required, Validators.minLength(4)]},
    {type: 'input',     label: 'Omschrijving',  name: 'description',  placeholder: 'Omschrijving',  value: '', validation: [Validators.required]},
    {type: 'pulldown',  label: 'Std. Maten',    name: 'measurements', placeholder: 'Std. Maten',    value: '', customLookupFld: {path: 'properties', tbl: 'property', fld: 'code'}, validation: [Validators.required]},
    {type: 'pulldown',  label: 'Std. Kleuren',  name: 'colors',       placeholder: 'Std. Kleuren',  value: '', customLookupFld: {path: 'properties', tbl: 'property', fld: 'code'}, validation: [Validators.required]},
  ]

