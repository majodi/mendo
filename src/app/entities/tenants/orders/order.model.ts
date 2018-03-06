import { Validators } from '@angular/forms';
import { EntityMeta } from "../../../models/entity-meta.model";
import { forceUppercase, forceCapitalize } from '../../../shared/dynamic-form/models/form-functions';

export interface Order {
    id: string;
    meta: EntityMeta;
    number: string;
    organisation: string; // organisation (redundant...)
    employee: string; // employee
    date: Date;
    total: number;
    line_count: number;
    status: string; // new, closed, processed, delivered, cancelled
}

export const defaultTitle = 'Orders'
export const defaultTitleIcon = 'list'
export const defaultColDef = [
    {name: 'number',            header: 'Order', sort: true},       // status with icon
    {name: 'date',              header: 'Datum', sort: true},
    {name: 'organisation_v',    header: 'Organisatie', sort: true, hideXs: true},
    {name: 'employee_v',        header: 'Medewerker', sort: true},
    {name: 'total',             header: 'Totaal'},
  ]
export const defaultFormConfig = [
    {type: 'input',     label: 'Order',         name: 'number',       placeholder: 'Ordernummer',  value: '', initWithCounter: 'orderNumber', disabled: true},
    {type: 'lookup',    label: 'Medewerker',    name: 'employee',     placeholder: 'Medewerker',   value: '', inputValueTransform: forceCapitalize, customLookupFld: {path: 'employees', tbl: 'employee', fld: 'address.name'}},
    {type: 'lookup',    label: 'Organisation',  name: 'organisation', placeholder: 'Organisation', value: '', doNotPopulate: true, inputValueTransform: forceCapitalize, customLookupFld: {path: 'organisations', tbl: 'organisation', fld: 'address.name'}},
]
// for selection button
export const defaultSelectionFields = [         // status - date
  {name: 'organisation'},
  {name: 'employee'},
]
