import { Validators } from '@angular/forms'
import { EntityMeta } from '../../../models/entity-meta.model'
import { forceUppercase } from '../../../shared/dynamic-form/models/form-functions'

export interface Document {
    id: string
    meta: EntityMeta
    code: string
    description: string
    name: string // url original upload
    fileName: string // pure filename
    tagList: {}
}

export const defaultTitle = 'Documenten'
export const defaultTitleIcon = 'insert_drive_file'
export const defaultColDef = [
    {name: 'code',        header: 'Code', sort: true},
    {name: 'description', header: 'Omschrijving'},
  ]
export const defaultFormConfig = [
    {type: 'input',     label: 'Code',          name: 'code',         placeholder: 'Code',          value: '', inputValueTransform: forceUppercase, validation: [Validators.required, Validators.minLength(4)]},
    {type: 'input',     label: 'Omschrijving',  name: 'description',  placeholder: 'Omschrijving',  value: '', validation: [Validators.required]},
    {type: 'chiplist',  label: 'Labels',        name: 'tagList',      placeholder: 'Labels',        value: '', options: 'SETTINGS+:DOCUMENT_LABELS&Privacy_verklaring,Disclaimer,Algemene_voorwaarden'},
    {type: 'filepick',  label: 'Document',      name: 'name',         placeholder: 'Document',      value: '', validation: [Validators.required]},
    {type: 'button',    label: 'Download',      name: 'download',     placeholder: 'Download',      value: ''},
  ]
  export const defaultSelectionFields = [
    {name: 'tagList'},
  ]
