import { Validators } from '@angular/forms';
import { EntityMeta } from '../../../models/entity-meta.model';

export interface Category {
    id: string;
    meta: EntityMeta;
    code: string;
    description: string;
    measurements: string; // property
    colors: string; // property
}

export const defaultTitle = 'Categorieën'
export const defaultTitleIcon = 'more'
export const defaultColDef = [
    {name: 'code',        header: 'Code', sort: true},
    {name: 'description', header: 'Omschrijving'},
  ]
export const defaultFormConfig = [
    {type: 'input', label: 'Code',          name: 'code',         placeholder: 'Code',          value: '', validation: [Validators.required, Validators.minLength(4)]},
    {type: 'input', label: 'Omschrijving',  name: 'description',  placeholder: 'Omschrijving',  value: '', validation: [Validators.required]},
    {type: 'input', label: 'Maten',         name: 'measurements', placeholder: 'Maten',         value: '', validation: [Validators.required]},
    {type: 'input', label: 'Kleuren',       name: 'colors',       placeholder: 'Kleuren',       value: '', validation: [Validators.required]},
  ]

