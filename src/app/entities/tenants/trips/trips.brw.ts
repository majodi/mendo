import { Component, OnInit, OnDestroy, Injector } from '@angular/core'

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template'
import { Trip, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './trip.model'
import { TripService } from './trip.service'

import { BrwBaseClass } from '../../../baseclasses/browse'
import { MatDialogRef } from '@angular/material'
import { Embed } from '../../../shared/dynamic-form/models/embed.interface'

@Component({
  selector: 'app-trip-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class TripBrwComponent extends BrwBaseClass<Trip[]> implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: TripService
  ) {
    super(dialogRef, entityService, injectorService)
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig.map(x => Object.assign({}, x))
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    // this.initialSortOrder = {fld: 'name', sortOrder: 'desc'}
    super.ngOnInit() // volgorde van belang!
  }

}
