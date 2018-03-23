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
    {type: 'lookup',        label: 'Artikel',   name: 'article',    placeholder: 'Artikel',  value: '',
        inputValueTransform: forceUppercase,
        customLookupFld: {path: 'articles', tbl: 'article', fld: 'code'},
        customLookupComponent: ArticlesBrwComponent,
        customLookupItem: {id: '', display: 'code', subDisplay: 'description_s', addSearch: 'description_l'},
        customUpdateWithLookup: [{fld: 'price_unit', lookupFld: 'price'}]
    },
    {type: 'stringdisplay', label: 'Prijs',     name: 'price_unit', placeholder: 'Prijs per eenheid',  value: '0'},
    {type: 'input',         label: 'Aantal',    name: 'number',     placeholder: 'Aantal',  value: '0'},
    {type: 'stringdisplay', label: 'Bedrag',    name: 'amount',     placeholder: 'Bedrag',  value: '0'},
]
