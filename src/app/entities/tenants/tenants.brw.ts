import { Component, OnInit, OnDestroy, Injector } from '@angular/core';

import { defaultTableTemplate } from '../../shared/custom-components/models/table-template';
import { Tenant, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './tenant.model'
import { TenantService } from './tenant.service';

import { BrwBaseClass } from '../../shared/custom-components/baseclasses/browse';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-tenants-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class TenantsBrwComponent extends BrwBaseClass<Tenant[]> implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: TenantService,
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
