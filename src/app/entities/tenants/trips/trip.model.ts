import { Validators } from '@angular/forms'
import { EntityMeta } from '../../../models/entity-meta.model'
import { forceCapitalize, forceUppercase } from '../../../shared/dynamic-form/models/form-functions'

export interface Trip {
    id: string
    meta: EntityMeta
    vehicle: string
    date: string
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
    {name: 'date',              header: 'Datum',    sort: true},
    {name: 'start_address_v',   header: 'Van',      sort: true},
    {name: 'end_address_v',     header: 'Naar',     sort: true},
  ]
export const defaultFormConfig = [
    {
        type: 'pulldown',
        label: 'Voertuig',
        name: 'vehicle',
        placeholder: 'Voertuig',
        value: '',
        customLookupFld: {path: 'vehicles', tbl: 'vehicle', fld: 'vehicle'},
    },
  ]
