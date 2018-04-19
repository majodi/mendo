import { Component, OnInit, OnDestroy, Injector } from '@angular/core';

import { defaultTableTemplate } from '../../../../shared/custom-components/models/table-template';
import { Employee, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig, defaultSelectionFields } from './employee.model'
import { EmployeeService } from './employee.service';
import { OrganisationService } from '../organisation.service';

import { BrwBaseClass } from '../../../../baseclasses/browse';
import { MatDialogRef } from '@angular/material';
import { Embed } from '../../../../shared/dynamic-form/models/embed.interface';
import { Organisation } from '../organisation.model';

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
      if(ctrl == 'organisation'){
        const branchChoices = this.formConfig[this.formConfig.findIndex(c => c.name == 'branchChoices')].value
        this.formConfig[this.formConfig.findIndex(c => c.name == 'branch')].options = branchChoices ? branchChoices.split(',') : []
      }
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
    {type: 'beforeChgDialog', code: (o) => {
      this.beforeForm('chg')
      return false
    }},
    {type: 'beforeInsertDialog', code: (o) => {
      this.beforeForm('ins')
      return false
    }},
    {type: 'beforeSave', code: (action, o) => {
      if(this.gs.backButton){
        o['organisation'] = this.gs.NavQueries.find(q => q.fld == 'organisation').value
      }
      return Promise.resolve()
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
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    this.selectionFields = defaultSelectionFields
    super.setPulldownItems(this.organisationSrv.initEntity$(), 'organisation', 'address.name', 'address.city')
    super.ngOnInit() //volgorde van belang!
  }

  beforeForm(action) {
    const organisationConfig = this.formConfig.find(fc => fc.name == 'organisation')
    const branchConfig = this.formConfig.find(fc => fc.name == 'branch')
    if(this.gs.backButton && organisationConfig != undefined){
      organisationConfig.doNotPopulate = true
      const organisation = this.gs.NavQueries.find(q => q.fld == 'organisation').value
      if(organisation != undefined && branchConfig != undefined){
        this.db.getDoc(`${this.gs.entityBasePath}/organisations/${organisation}`).then((o: Organisation) => {
          branchConfig.options = o.branches.split(',')
        })
      }
    }
  }

}
