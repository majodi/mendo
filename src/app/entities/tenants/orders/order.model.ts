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
    status: string; // new (fiber_new), closed (lock_outline), approved (thumb_up), processed (done), delivered (done_all), cancelled (cancel)
    history: string;
}

export const defaultTitle = 'Orders'
export const defaultTitleIcon = 'list'
export const defaultColDef = [
    {name: 'number',            header: 'Order', sort: true},
    {name: 'status',            header: 'Status', sort: true, iconSelect: rec => {
        if(rec['status'] == 'new') return 'fiber_new'
        if(rec['status'] == 'closed') return 'lock_outline'
        if(rec['status'] == 'approved') return 'thumb_up'
        if(rec['status'] == 'processed') return 'done'
        if(rec['status'] == 'delivered') return 'done_all'
        if(rec['status'] == 'cancelled') return 'cancel'
    }, iconColorSelect: rec => {
        if(rec['status'] == 'new') {return 'warn'} else {return 'primary'}
    }},
    {name: 'date',              header: 'Datum', format: (rec) => rec.date && typeof rec.date == 'object' ? rec.date.toISOString().substring(0,10) : '', sort: true, hideXs: true},
    {name: 'organisation_v',    header: 'Organisatie', sort: true, hideXs: true},
    {name: 'employee_v',        header: 'Medewerker', sort: true},
    {name: 'total',             header: 'Totaal'},
    {name: 'lines',             header: 'Regels', icon: 'view_list'},
  ]
export const defaultFormConfig = [
    {type: 'input',     label: 'Order',         name: 'number',       placeholder: 'Ordernummer',   value: '', initWithCounter: 'orderNumber', disabled: true},
    {type: 'select',    label: 'Status',        name: 'status',       placeholder: 'Status',        value: '', options: ['new', 'closed', 'approved', 'delivered', 'cancelled']},
    {type: 'lookup',    label: 'Medewerker',    name: 'employee',     placeholder: 'Medewerker',    value: '', inputValueTransform: forceCapitalize, customLookupFld: {path: 'employees', tbl: 'employee', fld: 'address.name'}},
    {type: 'lookup',    label: 'Organisation',  name: 'organisation', placeholder: 'Organisation',  value: '', doNotPopulate: true, inputValueTransform: forceCapitalize, customLookupFld: {path: 'organisations', tbl: 'organisation', fld: 'address.name'}},
]
// for selection button
export const defaultSelectionFields = [         // status - date
  {name: 'organisation'},
  {name: 'employee'},
  {name: 'status'}
]

//organisatie wordt niet getoond in selectieform omdat notpopulated (denk ik)