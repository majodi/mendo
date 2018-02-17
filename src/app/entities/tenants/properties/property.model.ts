import { Validators } from '@angular/forms';
import { EntityMeta } from '../../../models/entity-meta.model';

export interface Property {
    id: string;
    meta: EntityMeta;
    code: string;
    choices: string;
    placeholder: string;
}

export const defaultTitle = 'Kenmerken'
export const defaultTitleIcon = 'class'
export const defaultColDef = [
    {name: 'code',          header: 'Code', sort: true},
    {name: 'choices',       header: 'Keuzes', hideXs: true},
    {name: 'placeholder',   header: 'Prompt', hideXs: true},
  ]
export const defaultFormConfig = [
    {type: 'input', label: 'Code',      name: 'code',           placeholder: 'Code',    value: '', validation: [Validators.required, Validators.minLength(4)]},
    {type: 'input', label: 'Keuzes',    name: 'choices',        placeholder: 'Keuzes',  value: '', validation: [Validators.required]},
    {type: 'input', label: 'Prompt',    name: 'placeholder',    placeholder: 'Prompt',  value: '', validation: [Validators.required]},
  ]

