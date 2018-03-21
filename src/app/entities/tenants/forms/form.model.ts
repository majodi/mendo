import { Validators } from '@angular/forms';
import { EntityMeta } from '../../../models/entity-meta.model';
import { forceUppercase } from '../../../shared/dynamic-form/models/form-functions';

export interface Form {
    id: string;
    meta: EntityMeta;
    code: string;
    description: string;
}

export const defaultTitle = 'Formulieren'
export const defaultTitleIcon = 'art_track'
export const defaultColDef = [
    {name: 'code',        header: 'Code', sort: true},
    {name: 'description', header: 'Omschrijving'},
    {name: 'edit',        header: '', iconSelect: rec => 'edit'},
  ]
export const defaultFormConfig = [
    {type: 'input', label: 'Code',          name: 'code',         placeholder: 'Code',          value: '', inputValueTransform: forceUppercase, validation: [Validators.required, Validators.minLength(4)]},
    {type: 'input', label: 'Omschrijving',  name: 'description',  placeholder: 'Omschrijving',  value: '', validation: [Validators.required]},
  ]
