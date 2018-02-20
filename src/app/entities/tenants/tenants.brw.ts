import { Component, OnInit, OnDestroy } from '@angular/core';

import { defaultTableTemplate } from '../../shared/custom-components/models/table-template';
import { Tenant, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './tenant.model'
import { TenantService } from './tenant.service';
import { DbService } from '../../services/db.service';
import { PopupService } from '../../services/popup.service';
import { BrwBaseClass } from '../../shared/custom-components/baseclasses/browse';
import { EntityService } from '../../shared/custom-components/baseclasses/entity-service.interface';

@Component({
  selector: 'app-tenants-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class TenantsBrwComponent extends BrwBaseClass<Tenant[]> implements OnInit, OnDestroy {

  constructor(
    private entityService: TenantService,
    private dbService: DbService,
    private popupService: PopupService
  ) {
    super(entityService, dbService, popupService);
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    super.ngOnInit() //volgorde van belang!
  }

}
