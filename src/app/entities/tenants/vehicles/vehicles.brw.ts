import { Component, OnInit, OnDestroy, Injector } from '@angular/core'

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template'
import { Vehicle, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './vehicle.model'
import { VehicleService } from './vehicle.service'

import { BrwBaseClass } from '../../../baseclasses/browse'
import { MatDialogRef } from '@angular/material'

@Component({
  selector: 'app-vehicles-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class VehiclesBrwComponent extends BrwBaseClass<Vehicle[]> implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: VehicleService,
  ) {
    super(dialogRef, entityService, injectorService)
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig.map(x => Object.assign({}, x))
    // this.formConfig = defaultFormConfig
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    super.ngOnInit() // volgorde van belang!
  }

}
