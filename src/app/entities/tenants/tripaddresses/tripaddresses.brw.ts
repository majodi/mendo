import { Component, OnInit, OnDestroy, Injector } from '@angular/core'

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template'
import { TripAddress, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './tripaddress.model'
import { TripAddressService } from './tripaddress.service'

import { BrwBaseClass } from '../../../baseclasses/browse'
import { MatDialogRef } from '@angular/material'
import { Embed } from '../../../shared/dynamic-form/models/embed.interface'

@Component({
  selector: 'app-tripaddress-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class TripAddressBrwComponent extends BrwBaseClass<TripAddress[]> implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: TripAddressService
  ) {
    super(dialogRef, entityService, injectorService)
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig.map(x => Object.assign({}, x))
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    this.initialSortOrder = {fld: 'name', sortOrder: 'desc'}
    super.ngOnInit() // volgorde van belang!
  }

}
