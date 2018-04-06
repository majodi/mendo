import { Component, OnInit, OnDestroy, Injector } from '@angular/core';

import { defaultTableTemplate } from '../../../../shared/custom-components/models/table-template';
import { Employee, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig, defaultSelectionFields } from './employee.model'
import { EmployeeService } from './employee.service';
import { OrganisationService } from '../organisation.service';

import { BrwBaseClass } from '../../../../baseclasses/browse';
import { MatDialogRef } from '@angular/material';
import { Embed } from '../../../../shared/dynamic-form/models/embed.interface';

@Component({
  selector: 'app-employees-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class EmployeesBrwComponent extends BrwBaseClass<Employee[]> implements OnInit, OnDestroy {
  emailOnEntry = ''
  nameOnEntry = ''
  embeds: Embed[] = [
    {type: 'onValueChg', code: (ctrl, value, formAction?) => {
      if(ctrl == 'address.email'){
        if(formAction == undefined && value && value != this.emailOnEntry){
          this.db.syncEmailRecord(value, this.formConfig, 'address.name', 'medewerker')
        } else {
          this.emailOnEntry = value
        }
      }
      if(ctrl == 'address.name'){
        if(formAction == undefined && value && this.emailOnEntry && value != this.nameOnEntry){
          this.db.syncEmailRecord(this.emailOnEntry, this.formConfig, 'address.name', 'medewerker')
        } else {
          this.nameOnEntry = value
        }
      }
    }},
  ]

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: EmployeeService,
    private organisationSrv: OrganisationService,
  ) {
    super(dialogRef, entityService, injectorService);
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig.map(x => Object.assign({}, x));
    // this.formConfig = defaultFormConfig
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    this.selectionFields = defaultSelectionFields
    super.setPulldownItems(this.organisationSrv.initEntity$(), 'organisation', 'address.name', 'address.city')
    super.ngOnInit() //volgorde van belang!
  }

}
