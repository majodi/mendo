import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { SharedModule } from '../shared/shared.module';
import { PropertiesBrwComponent } from '../entities/tenants/properties/properties.brw';
import { OrganisationsBrwComponent } from '../entities/tenants/organisations/organisation.brw';
import { EmployeesBrwComponent } from '../entities/tenants/organisations/employees/employees.brw';
import { ImagesBrwComponent } from '../entities/tenants/images/images.brw';
import { SettingsBrwComponent } from '../entities/tenants/settings/settings.brw';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
    ],
  declarations: [
      PropertiesBrwComponent,
      OrganisationsBrwComponent,
      EmployeesBrwComponent,
      ImagesBrwComponent,
      SettingsBrwComponent,
    ],
  exports: [
      PropertiesBrwComponent,
      OrganisationsBrwComponent,
      EmployeesBrwComponent,
      ImagesBrwComponent,
      SettingsBrwComponent,
    ],
})
export class AppTenantModule { }
