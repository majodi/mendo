import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../auth-guard.service';
import { PropertiesBrwComponent } from '../entities/tenants/properties/properties.brw';
import { OrganisationsBrwComponent } from '../entities/tenants/organisations/organisation.brw';
import { EmployeesBrwComponent } from '../entities/tenants/organisations/employees/employees.brw';
import { ImagesBrwComponent } from '../entities/tenants/images/images.brw';
import { BulletinsBrwComponent } from '../entities/tenants/bulletins/bulletins.brw';
import { SettingsBrwComponent } from '../entities/tenants/settings/settings.brw';
import { FormsBrwComponent } from '../entities/tenants/forms/forms.brw';
import { FormFieldsBrwComponent } from '../entities/tenants/forms/formfields/formfields.brw';
import { FormResultsBrwComponent } from '../entities/tenants/forms/formresults/formresults.brw';

const app_tenantRoutes: Routes = [
  { path: '', canActivate: [AuthGuard],
    children: [
      { path: 'properties', component: PropertiesBrwComponent },
      { path: 'organisations', component: OrganisationsBrwComponent },
      { path: 'employees', component: EmployeesBrwComponent },
      { path: 'images', component: ImagesBrwComponent },
      { path: 'bulletins', component: BulletinsBrwComponent },
      { path: 'settings', component: SettingsBrwComponent },
      { path: 'forms', component: FormsBrwComponent },
      { path: 'formfields', component: FormFieldsBrwComponent },
      { path: 'formresults', component: FormResultsBrwComponent },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(app_tenantRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppTenantRoutingModule { }


