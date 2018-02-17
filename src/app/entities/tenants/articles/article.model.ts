import { Validators } from '@angular/forms';
import { EntityMeta } from "../../../models/entity-meta.model";

export interface Article {
    id: string;
    meta: EntityMeta;
    code: string;
    description_s: string;
    description_l: string;
    category: string; // category
    category_categoryCode: string; // virtual category code
    image: string; // asset
    measurements: string; // property choice
    colors: string; // property choice
    price: number;
    unit: string;
}

export const defaultTitle = 'Artikelen'
export const defaultTitleIcon = 'label outline'
export const defaultColDef = [
    {name: 'code',                  header: 'Code', sort: true},
    {name: 'description_s',         header: 'Omschrijving kort', hideXs: true},
    {name: 'category_categoryCode', header: 'Categorie', hideXs: true},
    {name: 'image',                 header: 'Afbeelding'},
    {name: 'price',                 header: 'Prijs'},
    {name: 'unit',                  header: 'Maatvoering'},
  ]
export const defaultFormConfig = [
    {type: 'input',     label: 'Code',              name: 'code',                   placeholder: 'Code',              value: '', validation: [Validators.required, Validators.minLength(4)]},
    {type: 'input',     label: 'Omschrijving kort', name: 'description_s',          placeholder: 'Omschrijving kort', value: '', validation: [Validators.required, Validators.minLength(4)]},
    {type: 'input',     label: 'Omschrijving lang', name: 'description_l',          placeholder: 'Omschrijving lang', value: ''},
    {type: 'pulldown',  label: 'Categorie',         name: 'category',               placeholder: 'Categorie',         value: ''},
    {type: 'input',     label: 'Afbeelding',        name: 'image',                  placeholder: 'Afbeelding',        value: ''},
    {type: 'input',     label: 'Maten',             name: 'measurements',           placeholder: 'Maten',             value: ''},
    {type: 'input',     label: 'Kleuren',           name: 'colors',                 placeholder: 'Kleuren',           value: ''},
    {type: 'input',     label: 'Prijs',             name: 'price',                  placeholder: 'Prijs',             value: '', validation: [Validators.required]},
    {type: 'input',     label: 'Maatvoering',       name: 'unit',                   placeholder: 'Maatvoering',       value: '', validation: [Validators.required]},
  ]

