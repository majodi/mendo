import { Validators } from '@angular/forms';
import { EntityMeta } from '../../../models/entity-meta.model';
import { forceUppercase } from '../../../shared/dynamic-form/models/form-functions';

export interface Image {
    id: string;
    meta: EntityMeta;
    code: string;
    description: string;
    name: string;
    url: string;
    thumbUrl: string;
    tagList: {};
}

export const defaultTitle = 'Afbeeldingen'
export const defaultTitleIcon = 'image'
export const defaultColDef = [
    {name: 'code',        header: 'Code', sort: true},
    {name: 'description', header: 'Omschrijving'},
  ]
export const defaultFormConfig = [
    {type: 'input',     label: 'Code',          name: 'code',         placeholder: 'Code',          value: '', inputValueTransform: forceUppercase, validation: [Validators.required, Validators.minLength(4)]},
    {type: 'input',     label: 'Omschrijving',  name: 'description',  placeholder: 'Omschrijving',  value: '', validation: [Validators.required]},
    {type: 'filepick',  label: 'Afbeelding',    name: 'name',         placeholder: 'Afbeelding',    value: '', validation: [Validators.required]},
  ]

