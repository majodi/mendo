import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { SharedModule } from '../shared/shared.module';

import { ImagesBrwComponent } from '../entities/tenants/images/images.brw';
import { ImageService } from '../entities/tenants/images/image.service';
import { EmployeesBrwComponent } from '../entities/tenants/organisations/employees/employees.brw';
import { EmployeeService } from '../entities/tenants/organisations/employees/employee.service';
import { OrganisationService } from '../entities/tenants/organisations/organisation.service';

import { OrdersBrwComponent } from '../entities/tenants/orders/orders.brw';
import { OrderService } from '../entities/tenants/orders/order.service';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
    ],
  declarations: [
      ImagesBrwComponent,
      EmployeesBrwComponent,
      OrdersBrwComponent,
    ],
  exports: [
      ImagesBrwComponent,
      EmployeesBrwComponent,
      OrdersBrwComponent,
    ],
  providers: [
      ImageService,
      EmployeeService,
      OrganisationService,
      OrderService,
    ]
})
export class AppLookupModule { }
