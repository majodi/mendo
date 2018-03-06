import { Component, OnInit, OnDestroy, Injector } from '@angular/core';

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template';
import { Order, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig, defaultSelectionFields } from './order.model'
import { OrderService } from './order.service';
import { OrganisationService } from '../organisations/organisation.service';
import { EmployeeService } from '../organisations/employees/employee.service';
import { EmployeesBrwComponent } from '../organisations/employees/employees.brw';
import { OrganisationsBrwComponent } from '../organisations/organisation.brw';

import { BrwBaseClass } from '../../../shared/custom-components/baseclasses/browse';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-orders-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class OrdersBrwComponent extends BrwBaseClass<Order[]> implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: OrderService,
    private employeeSrv: EmployeeService,
  ) {
    super(dialogRef, entityService, injectorService);
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    this.selectionFields = defaultSelectionFields
    super.setLookupComponent(EmployeesBrwComponent, 'employee', 'address.name', 'address.city')
    super.setLookupComponent(OrganisationsBrwComponent, 'organisation', 'address.name', 'address.city')
    super.ngOnInit() //volgorde van belang!
  }

  embed_beforeSave(action, o) {
    if(action == 1 || action == 2){
      return this.db.getDoc(`${this.gs.entityBasePath}/employees/${o['employee']}`).then(employee => {
        o['organisation'] = employee['organisation']
        if(action == 1){
          return this.db.getIncrementedCounter('orderNumber').then(number => {
            o['number'] = number
          })  
        } 
      })
    } else return new Promise<{}>(()=>{})
  }

}
