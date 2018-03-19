import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { SharedModule } from '../shared/shared.module';
import { PropertiesBrwComponent } from '../entities/tenants/properties/properties.brw';
import { PropertyService } from '../entities/tenants/properties/property.service';
import { OrganisationsBrwComponent } from '../entities/tenants/organisations/organisation.brw';
import { OrganisationService } from '../entities/tenants/organisations/organisation.service';
import { EmployeesBrwComponent } from '../entities/tenants/organisations/employees/employees.brw';
import { EmployeeService } from '../entities/tenants/organisations/employees/employee.service';
import { ImagesBrwComponent } from '../entities/tenants/images/images.brw';
import { ImageService } from '../entities/tenants/images/image.service';
import { SettingsBrwComponent } from '../entities/tenants/settings/settings.brw';
import { SettingService } from '../entities/tenants/settings/setting.service';
import { BulletinsBrwComponent } from '../entities/tenants/bulletins/bulletins.brw';

import { AppTenantRoutingModule } from './app_tenant.routing.module';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      AppTenantRoutingModule,
    ],
  declarations: [
      PropertiesBrwComponent,
      OrganisationsBrwComponent,
      EmployeesBrwComponent,
      ImagesBrwComponent,
      BulletinsBrwComponent,
      SettingsBrwComponent,
    ],
  exports: [
      PropertiesBrwComponent,
      OrganisationsBrwComponent,
      EmployeesBrwComponent,
      ImagesBrwComponent,
      BulletinsBrwComponent,
      SettingsBrwComponent,
    ],
  providers: [
      PropertyService,
      OrganisationService,
      EmployeeService,
      ImageService,
      SettingService,
    ]
})
export class AppTenantModule { }
