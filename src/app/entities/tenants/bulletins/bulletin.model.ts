import { Validators } from '@angular/forms'
import { EntityMeta } from '../../../models/entity-meta.model'
import { forceUppercase } from '../../../shared/dynamic-form/models/form-functions'

export interface Bulletin {
    id: string
    meta: EntityMeta
    date: Date
    title: string
    subtitle: string
    image: string // image
    text: string
    buttonText: string
    buttonLink: string
    sticky: boolean
    page: string
}

export const defaultTitle = 'Bulletins'
export const defaultTitleIcon = 'event_note'
export const defaultColDef = [
    {name: 'sticky',        header: 'Sticky', iconSelect: rec => {if (rec['sticky']) { return 'vertical_align_top' }}, flex: '10'},
    {name: 'date',          header: 'Datum', format: (rec) => !rec['sticky'] && rec.date !== undefined && rec.date !== null && rec.date && typeof rec.date === 'object' ? rec.date.toISOString().substring(0, 10) : '', sort: true},
    {name: 'page',          header: 'Pagina'},
    {name: 'title',         header: 'Titel'},
    {name: 'buttonLink',    header: 'Link'},
  ]
export const defaultFormConfig = [
    {type: 'checkbox',              label: 'Sticky',        name: 'sticky',       placeholder: 'Sticky',          value: false},
    {type: 'select',                label: 'Afwijkende Pagina', name: 'page',     placeholder: 'Afwijkende Pagina', value: '', options: ['SETTINGS:EXTRA_PAGES']},
    {type: 'input',                 label: 'Titel',         name: 'title',        placeholder: 'Bulletin Titel',  value: ''},
    {type: 'input', inputLines: 5,  label: 'Subtitel',      name: 'subtitle',     placeholder: 'Bulletin Subtitel',  value: ''},
    {type: 'datepicker',            label: 'Datum',         name: 'date',         placeholder: 'Datum', value: ''},
    {
        type: 'lookup',
        label: 'Afbeelding',
        name: 'image',
        placeholder: 'Afbeelding',
        value: '',
        inputValueTransform: forceUppercase,
        customLookupFld: {path: 'images', tbl: 'image', fld: 'code'},
        customUpdateWithLookup: [{fld: 'imagedisplay', lookupFld: 'name'}]
    },
    {type: 'imagedisplay',          label: 'Afbeelding',    name: 'imagedisplay', placeholder: 'Afbeelding',      value: '', imageStyle: {'width': '100%'}},
    {type: 'input', inputLines: 5,  label: 'Textboodschap', name: 'text',         placeholder: 'Textboodschap',   value: ''},
    {type: 'input',                 label: 'Button Text',   name: 'buttonText',   placeholder: 'Button Text',     value: ''},
    {type: 'input',                 label: 'Button Link',   name: 'buttonLink',   placeholder: 'Button Link',     value: ''},
  ]

//   {name: 'date',        header: 'Datum', format: (rec) => rec.date !== undefined && rec.date !== null && rec.date && typeof rec.date === 'object' ? rec.date.toISOString().substring(0, 10) : '', sort: true},
