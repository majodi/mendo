import { Validators } from '@angular/forms';
import { EntityMeta } from "../../../models/entity-meta.model";
import { forceUppercase, forceCapitalize } from '../../../shared/dynamic-form/models/form-functions';

export interface Article {
    id: string;
    meta: EntityMeta;
    code: string;
    description_s: string;
    description_l: string;
    category: string; // category
    image: string; // image
    measurements: string; // property
    overruleMeasurements: boolean;
    measurementsOverrule: {};
    colors: string; // property
    overruleColors: boolean;
    colorsOverrule: {};
    price: number;
    priceOverrule: {};
    unit: string;
    priority: string;
}

export const defaultTitle = 'Artikelen'
export const defaultTitleIcon = 'label outline'
export const defaultColDef = [
    {name: 'code',            header: 'Code', sort: true},
    {name: 'description_s',   header: 'Omschrijving kort', hideXs: true},
    {name: 'category_v',      header: 'Categorie', hideXs: true},
    {name: 'image_v',         header: 'Afbeelding', imageSelect: (rec) => rec.image_v, imageIdField: 'image'},
    {name: 'price',
      header: 'Prijs algemeen (kies)',
      headerSelect: [{value:'', viewValue:''}],
      headerSelectValue: '',
      format: (rec, colvalue) => rec['priceOverrule'] && colvalue ? rec['priceOverrule'][colvalue] ? rec['priceOverrule'][colvalue] : rec['price'] : rec['price']},
    {name: 'unit',            header: 'Maatvoering', hideXs: true},
  ]

export const defaultFormConfig = [
    {type: 'input',                 label: 'Artikelcode',       name: 'code',                 placeholder: 'Artikelcode',       value: '', inputValueTransform: forceUppercase, validation: [Validators.required, Validators.minLength(3)]},
    {type: 'input',                 label: 'Omschrijving kort', name: 'description_s',        placeholder: 'Omschrijving kort', value: '', validation: [Validators.required, Validators.minLength(4)]},
    {type: 'input', inputLines: 5,  label: 'Omschrijving lang', name: 'description_l',        placeholder: 'Omschrijving lang', value: '',},
    {type: 'pulldown',              label: 'Categorie',         name: 'category',             placeholder: 'Categorie',         value: '', customLookupFld: {path: 'categories', tbl: 'category', fld: 'code'}, customUpdateWithLookup: [{fld: 'measurements', lookupFld: 'measurements', onlyVirgin: true}, {fld: 'colors', lookupFld: 'colors', onlyVirgin: true}]},
    {type: 'lookup',                label: 'Afbeelding',        name: 'image',                placeholder: 'Afbeelding',        value: '', inputValueTransform: forceUppercase, customLookupFld: {path: 'images', tbl: 'image', fld: 'code', overruleVirtual: 'thumbName'}, customUpdateWithLookup: [{fld: 'imagedisplay', lookupFld: 'name'}]},
    {type: 'imagedisplay',          label: 'Afbeelding',        name: 'imagedisplay',         placeholder: 'Afbeelding',        value: '', imageStyle: {'width': '100%'}},
    {type: 'pulldown',              label: 'Maten',             name: 'measurements',         placeholder: 'Maten',             value: '', customLookupFld: {path: 'properties', tbl: 'property', fld: 'code'}, customUpdateWithLookup: [{fld: 'measurementsChoices', lookupFld: 'choices'}]},
    {type: 'checkbox',              label: 'Afwijkende maatmogelijkheden', name: 'overruleMeasurements', placeholder: 'Afwijkende maatmogelijkheden', value: true},
    {type: 'stringdisplay',         label: 'Maatkeuzes',        name: 'measurementsChoices',  placeholder: 'Maatkeuzes',        value: '', doNotPopulate: true},
    {type: 'chiplist',              label: 'Maten selectie',    name: 'measurementsOverrule', placeholder: 'Maten selectie',    value: ''},
    {type: 'pulldown',              label: 'Kleuren',           name: 'colors',               placeholder: 'Kleuren',           value: '', customLookupFld: {path: 'properties', tbl: 'property', fld: 'code'}, customUpdateWithLookup: [{fld: 'colorsChoices', lookupFld: 'choices'}]},
    {type: 'checkbox',              label: 'Afwijkende kleurmogelijkheden', name: 'overruleColors', placeholder: 'Afwijkende kleurmogelijkheden', value: true},
    {type: 'stringdisplay',         label: 'Kleurkeuzes',       name: 'colorsChoices',        placeholder: 'Kleurkeuzes',       value: '', doNotPopulate: true},
    {type: 'chiplist',              label: 'Kleuren selectie',  name: 'colorsOverrule',       placeholder: 'Kleuren selectie',  value: ''},
    {type: 'input',                 label: 'Prijs',             name: 'price',                placeholder: 'Prijs',             value: '', validation: [Validators.required]},
    {type: 'input',                 label: 'Eenheid',           name: 'unit',                 placeholder: 'Eenheid',           value: '', validation: [Validators.required]},
    {type: 'input',                 label: 'Prioriteit',        name: 'priority',             placeholder: 'Prioriteit',        value: ''},
  ]
// for selection button
export const defaultSelectionFields = [
  {name: 'category'},
]
