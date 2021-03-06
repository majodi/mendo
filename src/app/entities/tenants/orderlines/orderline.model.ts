import { Validators } from '@angular/forms'
import { EntityMeta } from '../../../models/entity-meta.model'
import { forceUppercase, forceCapitalize } from '../../../shared/dynamic-form/models/form-functions'
import { ArticlesBrwComponent } from '../articles/articles.brw'
import { FieldConfig } from '../../../shared/dynamic-form/models/field-config.interface'
import { GlobService } from '../../../services/glob.service'

export interface OrderLine {
    id: string
    meta: EntityMeta
    order: string // order
    article: string // article
    price_unit: number
    size: string
    color: string
    number: number
    amount: number
    thumbNameOnSave: string // article image on last save (is how the user ordered it...)
}

export const defaultTitle = 'Orderregels'
export const defaultTitleIcon = 'view_list'
export const defaultColDef = [
    {name: 'article_v',         header: 'Artikel', sort: true},
    {name: 'thumbNameOnSave',   header: 'Afbeelding', imageSelect: (rec) => rec.thumbNameOnSave, imageIdField: 'image'},
    {name: 'price_unit',        header: 'Prijs'},
    {name: 'number',            header: 'Aantal'},
    {name: 'amount',            header: 'Bedrag'},
    {name: 'meta_modifier_v',   header: 'Besteller'},
  ]

export const defaultFormConfig: FieldConfig[] = [
    {type: 'lookup',        label: 'Artikel',   name: 'article',    placeholder: 'Artikel',  value: '', doNotPopulate: false,
        inputValueTransform: forceUppercase,
        // customLookupFld: {path: 'articles', tbl: 'article', fld: 'description_s'},
        customLookupFld: {path: 'articles', tbl: 'article', fld: 'code'},
        customLookupComponent: ArticlesBrwComponent,
        customLookupItem: {id: '', display: 'code', subDisplay: 'description_s', addSearch: 'description_l'},
        customUpdateWithLookup: [
            {fld: 'description_s', lookupFld: 'description_s'},
            {fld: 'description_l', lookupFld: 'description_l'},
            {fld: 'price_unit', lookupFunction: (rec, gs: GlobService) => {
                return gs.activeUser.organisation && rec.priceOverrule && rec.priceOverrule[gs.activeUser.organisation] ? rec.priceOverrule[gs.activeUser.organisation] : rec.price
            }},
            {fld: 'sizes', lookupFld: 'measurements'},
            {fld: 'overruleSizes', lookupFld: 'overruleMeasurements'},
            {fld: 'overruleSizesChoices', lookupFld: 'measurementsOverrule'},
            {fld: 'colors', lookupFld: 'colors'},
            {fld: 'overruleColors', lookupFld: 'overruleColors'},
            {fld: 'overruleColorsChoices', lookupFld: 'colorsOverrule'},
            {fld: 'imageid', lookupFld: 'image'}
        ]
    },
    {type: 'lookup',        label: 'Besteller',     name: 'meta.modifier',  placeholder: 'Besteller',   value: '', doNotPopulate: false, hidden: true, customLookupFld: {path: 'users', tbl: 'user', fld: 'displayName'}},
    {type: 'stringdisplay', label: 'Afbeelding',    name: 'imageid',        placeholder: 'Afbeelding',  value: '', doNotPopulate: true},
    {type: 'imagedisplay',  label: 'Afbeelding',    name: 'imagedisplay',   placeholder: 'Afbeelding',  value: '', imageStyle: {'width': '50%'}},
    {type: 'stringdisplay', label: 'Artikel',       name: 'description_s',  placeholder: 'Artikel',     value: '', doNotPopulate: true},
    {type: 'stringdisplay', label: 'Omschrijving',  name: 'description_l',  placeholder: 'Omschrijving', value: '', doNotPopulate: true},
    {type: 'stringdisplay', label: 'Prijs',         name: 'price_unit',     placeholder: 'Prijs per eenheid',  value: '0'},
    {type: 'stringdisplay', label: 'Maten',         name: 'sizes',          placeholder: 'Maten',       value: '', doNotPopulate: true},
    {type: 'stringdisplay', label: 'Afwijkende maten', name: 'overruleSizes', placeholder: 'Afwijkende maten', value: '', doNotPopulate: true},
    {type: 'stringdisplay', label: 'Afwijkende maatkeuzes', name: 'overruleSizesChoices', placeholder: 'Afwijkende maatkeuzes', value: '', doNotPopulate: true},
    {type: 'select',        label: 'Maat',          name: 'size',           placeholder: 'Maat',        value: '', options: [], validation: [Validators.required]},
    {type: 'stringdisplay', label: 'Kleuren',       name: 'colors',         placeholder: 'Kleuren',     value: '', doNotPopulate: true},
    {type: 'stringdisplay', label: 'Afwijkende kleuren', name: 'overruleColors', placeholder: 'Afwijkende kleuren', value: '', doNotPopulate: true},
    {type: 'stringdisplay', label: 'Afwijkende kleurkeuzes', name: 'overruleColorsChoices', placeholder: 'Afwijkende kleurkeuzes', value: '', doNotPopulate: true},
    {type: 'select',        label: 'Kleur',         name: 'color',          placeholder: 'Kleur',       value: '', options: []},
    {type: 'input',         label: 'Aantal',        name: 'number',         placeholder: 'Aantal',      value: '0'},
    {type: 'stringdisplay', label: 'Bedrag',        name: 'amount',         placeholder: 'Bedrag',      value: '0'},
    {type: 'stringdisplay', label: 'thumbNameOnSave', name: 'thumbNameOnSave', placeholder: 'thumbNameOnSave', value: '', hidden: true},
]
