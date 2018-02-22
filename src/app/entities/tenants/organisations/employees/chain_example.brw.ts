import { Component, OnInit, OnDestroy } from '@angular/core';

import { defaultTableTemplate } from '../../../../shared/custom-components/models/table-template';
import { Employee, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './employee.model'
import { EmployeeService } from './employee.service';
import { DbService } from '../../../../services/db.service';
import { PopupService } from '../../../../services/popup.service';
import { GlobService } from '../../../../services/glob.service';


import { BrwBaseClass } from '../../../../shared/custom-components/baseclasses/browse';
// import { EntityService } from '../../../../shared/custom-components/baseclasses/entity-service.interface';

@Component({
  selector: 'app-employees-brw',
  template: `
  <app-organisations-brw [select]="true" (selected)="setSelection($event)"></app-organisations-brw>
  <br>
  <app-table
    [title]="title"
    [titleIcon]="titleIcon"
    [isLoading]="isLoading"
    [selectionButton]="selectionButton"
    [data]="data"
    [columnDefs]="colDef"
    (clicked)="clicked($event)"
  ></app-table>  
  `,
  styles: [``]
})
export class EmployeesBrwComponent extends BrwBaseClass<Employee[]> implements OnInit, OnDestroy {

  constructor(
    private entityService: EmployeeService,
    private dbService: DbService,
    private popupService: PopupService,
    private globService: GlobService,
  ) {
    super(entityService, dbService, popupService, globService);
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    // this.globService.entityId['organisations'] = 'fTq2haAUEZrFr2g5UlTZ' //even een test
    // this.baseQueries = [{fld: 'organisation', operator: '==', value: this.globService.entityId['organisations']}] //{ Fld: 'organisation', idProviderTable: 'organisations'}
    super.ngOnInit() //volgorde van belang!
  }

  setSelection(brwClick) {
    this.initDataSource([{fld: 'organisation', operator: '==', value: brwClick.rec.id}])
  }

}
