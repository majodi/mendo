import { Validators } from '@angular/forms'
import { EntityMeta } from '../../../../models/entity-meta.model'
import { forceUppercase } from '../../../../shared/dynamic-form/models/form-functions'
import { ColumnDefenition } from '../../../../shared/custom-components/models/column-defenition.model'
import { FieldConfig } from '../../../../shared/dynamic-form/models/field-config.interface'

export interface FormField {
    id: string
    meta: EntityMeta
    form: string // form
    order: number
    showInBrw: boolean
    hideXs: boolean
    sort: boolean
    filter: boolean
    name: string
    type: string
    label: string
    transform: string
    required: boolean
    isEmail: boolean
    emailNameField: string
    minLength: number
    options: string
    value: string
    image: string // image
    colDef: ColumnDefenition[]
    formConfig: FieldConfig[]
    }

export const defaultTitle = 'Formuliervelden'
export const defaultTitleIcon = 'drag_handle'
export const defaultColDef = [
    {name: 'order', header: 'Volgorde', sort: true},
    {name: 'name',  header: 'Veldnaam'},
    {name: 'type',  header: 'Type'},
  ]
export const defaultFormConfig = [
    {type: 'input',     label: 'Veldnaam',      name: 'name',       placeholder: 'Veldnaam',                value: '', validation: [Validators.required]},
    {type: 'select',    label: 'Type',          name: 'type',       placeholder: 'Veld Type',               value: '', options: ['invoer', 'keuze', 'vink', 'tekst', 'afbeelding']},
    {type: 'input',     label: 'Prompt',        name: 'label',      placeholder: 'Prompt',                  value: ''},
    {type: 'select',    label: 'Transformatie', name: 'transform',  placeholder: 'Invoer transformatie',    value: '', options: ['geen', 'hoofdletters', 'woord-hoofdletter']},
    {type: 'checkbox',  label: 'Verplicht',     name: 'required',   placeholder: 'Invoer verplicht',        value: false},
    {type: 'checkbox',  label: 'Is Email',      name: 'isEmail',    placeholder: 'Is Email',                value: false},
    {type: 'input',     label: 'Email naam veld', name: 'emailNameField', placeholder: 'Email naam veld',   value: ''},
    {type: 'input',     label: 'Min. Lengte',   name: 'minLength',  placeholder: 'Minimale lengte',         value: '', inputType: 'number'},
    {type: 'input',     label: 'Keuze Opties',  name: 'options',    placeholder: 'Keuze Opties',            value: ''},
    {type: 'input',     label: 'Waarde',        name: 'value',      placeholder: 'Veld Waarde',             value: ''},
    {
        type: 'lookup',
        label: 'Afbeelding',
        name: 'image',
        placeholder: 'Afbeelding',
        value: '',
        inputValueTransform: forceUppercase,
        customLookupFld: {path: 'images', tbl: 'image', fld: 'code', overruleVirtual: 'thumbName'},
        customUpdateWithLookup: [{fld: 'imagedisplay', lookupFld: 'name'}]
    },
    {type: 'imagedisplay',  label: 'Afbeelding',          name: 'imagedisplay',     placeholder: 'Afbeelding',            value: '', imageStyle: {'width': '100%'}},
    {type: 'input',         label: 'Afw. Volgorde',       name: 'order',            placeholder: 'Afwijkende Volgorde',   value: '', inputType: 'number'},
    {type: 'stringdisplay', label: 'Tabelinstelling',     name: 'tabelinstelling',  placeholder: 'Tabelinstelling',       value: ''},
    {type: 'checkbox',      label: 'Toon in tabel',       name: 'showInBrw',        placeholder: 'Toon in tabel',         value: false},
    {type: 'checkbox',      label: 'Verberg mobiel',      name: 'hideXs',           placeholder: 'Verberg mobiel',        value: false},
    {type: 'checkbox',      label: 'Sorteermogelijkheid', name: 'allowSort',        placeholder: 'Sorteermogelijkheid',   value: false},
    {type: 'checkbox',      label: 'Filtermogelijkheid',  name: 'allowfilter',      placeholder: 'Filtermogelijkheid',    value: false},
  ]
