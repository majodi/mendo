import { Component, OnInit, OnDestroy, Injector } from '@angular/core';

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template';
import { Organisation, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './organisation.model'
import { OrganisationService } from './organisation.service';

import { BrwBaseClass } from '../../../baseclasses/browse';
import { MatDialogRef } from '@angular/material';
import { Embed } from '../../../shared/dynamic-form/models/embed.interface';

@Component({
  selector: 'app-organisations-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class OrganisationsBrwComponent extends BrwBaseClass<Organisation[]> implements OnInit, OnDestroy {
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
    {type: 'beforeChgDialog', code: (rec, fld) => {
      if(fld == 'employees'){
        this.gs.navigateWithQuery('app-tenant/employees', 'organisation', '==', rec['id'])
        return true
      }
      return false
    }}
  ]

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
