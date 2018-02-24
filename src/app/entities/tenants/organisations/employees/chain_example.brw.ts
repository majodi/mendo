import { Component, OnInit, OnDestroy, Injector } from '@angular/core';

import { defaultTableTemplate } from '../../../../shared/custom-components/models/table-template';
import { Employee, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './employee.model'
import { EmployeeService } from './employee.service';

import { BrwBaseClass } from '../../../../shared/custom-components/baseclasses/browse';
import { MatDialogRef } from '@angular/material';

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
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: EmployeeService,
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

  setSelection(brwClick) {
    this.initDataSource([{fld: 'organisation', operator: '==', value: brwClick.rec.id}])
  }

}
