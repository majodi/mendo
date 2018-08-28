import { Component, OnInit, OnDestroy, Injector } from '@angular/core'

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template'
import { Trip, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './trip.model'
import { TripService } from './trip.service'
import { VehicleService } from '../vehicles/vehicle.service'
import { TripAddressService } from '../tripaddresses/tripaddress.service'

import { BrwBaseClass } from '../../../baseclasses/browse'
import { MatDialogRef } from '@angular/material'
import { Embed } from '../../../shared/dynamic-form/models/embed.interface'
import { take } from '../../../../../node_modules/rxjs/operators'

@Component({
  selector: 'app-trip-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class TripBrwComponent extends BrwBaseClass<Trip[]> implements OnInit, OnDestroy {
  embeds: Embed[] = [
    {type: 'onValueChg', code: (ctrl, value, formAction?) => {
      const private_tripConfig = this.formConfig.find(fc => fc.name === 'private_trip')
      const private_distConfig = this.formConfig.find(fc => fc.name === 'private_dist')
      const private_tripValue = private_tripConfig !== undefined ? private_tripConfig['value'] : false
      if (private_tripValue === 'true' || private_tripValue === true) { // imported data waren allemaal strings, one-time fix for that
        private_distConfig.doNotPopulate = true
      } else {
        private_distConfig.doNotPopulate = false
      }
    }},
    {type: 'beforeInsertDialogAsync', code: (rec) => {
      return this.db.getOnOrder(`${this.gs.entityBasePath}/trips`, 'end_mileage', 'desc', '9999999', false, 1).pipe(take(1)).toPromise()
      .then(last => {
        if (last.length > 0) {
          rec['vehicle'] = last[0]['vehicle']
          rec['start_mileage'] = last[0]['end_mileage']
          rec['start_address'] = last[0]['end_address']
        }
        rec['date'] = new Date()
        return Promise.resolve()
      })
    }},
  ]

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: TripService,
    private vehicleSrv: VehicleService,
    private tripAddressSrv: TripAddressService,
  ) {
    super(dialogRef, entityService, injectorService)
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig.map(x => Object.assign({}, x))
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    this.initialSortOrder = {fld: 'end_mileage', sortOrder: 'desc'}
    super.setPulldownItems(this.vehicleSrv.initEntity$(), 'vehicle', 'code', 'description')
    super.setPulldownItems(this.tripAddressSrv.initEntity$(), 'start_address', 'code', 'name')
    super.setPulldownItems(this.tripAddressSrv.initEntity$(), 'end_address', 'code', 'name')
    super.setPulldownItems(this.tripAddressSrv.initEntity$(), 'via_address', 'code', 'name')
    super.ngOnInit() // volgorde van belang!
  }

}
