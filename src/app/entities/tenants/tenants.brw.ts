import { Component, OnInit, OnDestroy, Injector } from '@angular/core';

import { defaultTableTemplate } from '../../shared/custom-components/models/table-template';
import { Tenant, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './tenant.model'
import { TenantService } from './tenant.service';

import { BrwBaseClass } from '../../baseclasses/browse';
import { MatDialogRef } from '@angular/material';
import { Embed } from '../../shared/dynamic-form/models/embed.interface';

@Component({
  selector: 'app-tenants-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class TenantsBrwComponent extends BrwBaseClass<Tenant[]> implements OnInit, OnDestroy {
  emailOnEntry = ''
  nameOnEntry = ''
  embeds: Embed[] = [
    {type: 'onValueChg', code: (ctrl, value, formAction?) => {
      if(ctrl == 'address.email'){
        if(formAction == undefined && value && value != this.emailOnEntry){
          this.db.syncEmailRecord(value, this.formConfig, 'address.name', 'tenant')
        } else {
          this.emailOnEntry = value
        }
      }
      if(ctrl == 'address.name'){
        if(formAction == undefined && value && this.emailOnEntry && value != this.nameOnEntry){
          this.db.syncEmailRecord(this.emailOnEntry, this.formConfig, 'address.name', 'tenant')
        } else {
          this.nameOnEntry = value
        }
      }
    }},
  ]

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: TenantService,
  ) {
    super(dialogRef, entityService, injectorService);
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig.map(x => Object.assign({}, x));
    // this.formConfig = defaultFormConfig
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    super.ngOnInit() //volgorde van belang!
  }

}
