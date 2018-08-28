import { Validators } from '@angular/forms'
import { EntityMeta } from '../../../models/entity-meta.model'
import { forceCapitalize, forceUppercase } from '../../../shared/dynamic-form/models/form-functions'

export interface Trip {
    id: string
    meta: EntityMeta
    vehicle: string
    date: Date
    start_mileage: number
    start_address: string
    end_mileage: number
    end_address: string
    private_trip: boolean
    via_address: string
    private_dist: number
    remarks: string
}

export const defaultTitle = 'Trips'
export const defaultTitleIcon = 'directions'
export const defaultColDef = [
    {name: 'date',              header: 'Datum',        sort: true},
    {name: 'start_address_v',   header: 'Van',          sort: true},
    {name: 'end_address_v',     header: 'Naar',         sort: true},
    {name: 'private_kms',       header: 'Private KMs',  format: (rec, colvalue) => rec['private_trip'] ? rec['end_mileage'] - rec['start_mileage'] : rec['private_dist']},
    {name: 'end_mileage',       header: 'Eindstand',    sort: true},
  ]
export const defaultFormConfig = [
    {
        type: 'pulldown',
        label: 'Voertuig',
        name: 'vehicle',
        placeholder: 'Voertuig',
        value: '',
        customLookupFld: {path: 'vehicles', tbl: 'vehicle', fld: 'code'},
    },
    {type: 'datepicker',    label: 'Datum',         name: 'date',           placeholder: 'Datum',           value: ''},
    {
        type: 'pulldown',
        label: 'Start',
        name: 'start_address',
        placeholder: 'Startadres',
        value: '',
        customLookupFld: {path: 'tripaddresses', tbl: 'tripaddress', fld: 'code'},
    },
    {type: 'input',         label: 'Beginstand',    name: 'start_mileage',  placeholder: 'Beginstand',      value: '', validation: [Validators.required]},
    {
        type: 'pulldown',
        label: 'Eind',
        name: 'end_address',
        placeholder: 'Eindadres',
        value: '',
        customLookupFld: {path: 'tripaddresses', tbl: 'tripaddress', fld: 'code'},
    },
    {type: 'input',         label: 'Eindstand',     name: 'end_mileage',    placeholder: 'Eindstand',       value: '', validation: [Validators.required]},
    {type: 'checkbox',      label: 'Privé',         name: 'private_trip',   placeholder: 'Privé trip',      value: false},
    {
        type: 'pulldown',
        label: 'Via',
        name: 'via_address',
        placeholder: 'Via adres',
        value: '',
        customLookupFld: {path: 'tripaddresses', tbl: 'tripaddress', fld: 'code'},
    },
    {type: 'input',         label: 'Privé afstand', name: 'private_dist',   placeholder: 'Privé afstand',   value: ''},
    {type: 'input', inputLines: 3,  label: 'Opmerkingen',   name: 'remarks',    placeholder: 'Opmerkingen', value: ''},
  ]
