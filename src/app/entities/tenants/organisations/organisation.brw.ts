import { Component, OnInit, OnDestroy, Injector } from '@angular/core';

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template';
import { Organisation, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './organisation.model'
import { OrganisationService } from './organisation.service';

import { BrwBaseClass } from '../../../baseclasses/browse';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-organisations-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class OrganisationsBrwComponent extends BrwBaseClass<Organisation[]> implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: OrganisationService
  ) {
    super(dialogRef, entityService, injectorService);
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    super.ngOnInit() //volgorde van belang!
  }

}
