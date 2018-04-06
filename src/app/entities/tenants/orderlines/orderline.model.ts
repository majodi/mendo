import { Validators } from '@angular/forms';
import { EntityMeta } from "../../../models/entity-meta.model";
import { forceUppercase, forceCapitalize } from '../../../shared/dynamic-form/models/form-functions';
import { ArticlesBrwComponent } from '../articles/articles.brw';

export interface OrderLine {
    id: string;
    meta: EntityMeta;
    order: string; // order
    article: string; // article
    price_unit: number;
    size: string;
    color: string;
    number: number;
    amount: number;    
}

export const defaultTitle = 'Orderregels'
export const defaultTitleIcon = 'view_list'
export const defaultColDef = [
    {name: 'article_v',         header: 'Artikel', sort: true},
    {name: 'price_unit',        header: 'Prijs'},
    {name: 'number',            header: 'Aantal'},
    {name: 'amount',            header: 'Bedrag'},
  ]
export const defaultFormConfig = [
    {type: 'lookup',        label: 'Artikel',   name: 'article',    placeholder: 'Artikel',  value: '', doNotPopulate: false,
        inputValueTransform: forceUppercase,
        customLookupFld: {path: 'articles', tbl: 'article', fld: 'code'},
        customLookupComponent: ArticlesBrwComponent,
        customLookupItem: {id: '', display: 'code', subDisplay: 'description_s', addSearch: 'description_l'},
        customUpdateWithLookup: [
            {fld: 'description_s', lookupFld: 'description_s'},
            {fld: 'description_l', lookupFld: 'description_l'},
            {fld: 'price_unit', lookupFld: 'price'},
            {fld: 'sizes', lookupFld: 'measurements'},
            {fld: 'overruleSizes', lookupFld: 'overruleMeasurements'},
            {fld: 'overruleSizesChoices', lookupFld: 'measurementsOverrule'},
            {fld: 'colors', lookupFld: 'colors'},
            {fld: 'overruleColors', lookupFld: 'overruleColors'},
            {fld: 'overruleColorsChoices', lookupFld: 'colorsOverrule'},
            {fld: 'imageid', lookupFld: 'image'}
        ]
    },
    {type: 'stringdisplay', label: 'Afbeelding',    name: 'imageid',        placeholder: 'Afbeelding',  value: '', doNotPopulate: true},
    {type: 'imagedisplay',  label: 'Afbeelding',    name: 'imagedisplay',   placeholder: 'Afbeelding',  value: ''},
    {type: 'stringdisplay', label: 'Artikel',       name: 'description_s',  placeholder: 'Artikel',     value: '', doNotPopulate: true},
    {type: 'stringdisplay', label: 'Omschrijving',  name: 'description_l',  placeholder: 'Omschrijving', value: '', doNotPopulate: true},
    {type: 'stringdisplay', label: 'Prijs',         name: 'price_unit',     placeholder: 'Prijs per eenheid',  value: '0'},
    {type: 'stringdisplay', label: 'Maten',         name: 'sizes',          placeholder: 'Maten',       value: '', doNotPopulate: true},
    {type: 'stringdisplay', label: 'Afwijkende maten', name: 'overruleSizes', placeholder: 'Afwijkende maten', value: '', doNotPopulate: true},
    {type: 'stringdisplay', label: 'Afwijkende maatkeuzes', name: 'overruleSizesChoices', placeholder: 'Afwijkende maatkeuzes', value: '', doNotPopulate: true},
    {type: 'select',        label: 'Maat',          name: 'size',           placeholder: 'Maat',        value: '', options: []},
    {type: 'stringdisplay', label: 'Kleuren',       name: 'colors',         placeholder: 'Kleuren',     value: '', doNotPopulate: true},
    {type: 'stringdisplay', label: 'Afwijkende kleuren', name: 'overruleColors', placeholder: 'Afwijkende kleuren', value: '', doNotPopulate: true},
    {type: 'stringdisplay', label: 'Afwijkende kleurkeuzes', name: 'overruleColorsChoices', placeholder: 'Afwijkende kleurkeuzes', value: '', doNotPopulate: true},
    {type: 'select',        label: 'Kleur',         name: 'color',          placeholder: 'Kleur',       value: '', options: []},
    {type: 'input',         label: 'Aantal',        name: 'number',         placeholder: 'Aantal',      value: '0'},
    {type: 'stringdisplay', label: 'Bedrag',        name: 'amount',         placeholder: 'Bedrag',      value: '0'},
]
