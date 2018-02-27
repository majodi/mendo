import { Validators } from '@angular/forms';
import { EntityMeta } from '../../../models/entity-meta.model';
import { forceUppercase } from '../../../shared/dynamic-form/models/form-functions';

export interface Setting {
    id: string;
    meta: EntityMeta;
    code: string;
    setting: string;
}

export const defaultTitle = 'Instellingen'
export const defaultTitleIcon = 'settings'
export const defaultColDef = [
    {name: 'code',          header: 'Code', sort: true},
    {name: 'setting',       header: 'Instelling', hideXs: true},
  ]
export const defaultFormConfig = [
    {type: 'input', label: 'Code',        name: 'code',     placeholder: 'Code',        value: '', inputValueTransform: forceUppercase, validation: [Validators.required, Validators.minLength(4)]},
    {type: 'input', label: 'Instelling',  name: 'setting',  placeholder: 'Instelling',  value: '', validation: [Validators.required]},
  ]

