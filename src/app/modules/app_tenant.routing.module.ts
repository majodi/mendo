import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { AuthGuard } from '../auth-guard.service'
import { PropertiesBrwComponent } from '../entities/tenants/properties/properties.brw'
import { OrganisationsBrwComponent } from '../entities/tenants/organisations/organisation.brw'
import { EmployeesBrwComponent } from '../entities/tenants/organisations/employees/employees.brw'
import { ImagesBrwComponent } from '../entities/tenants/images/images.brw'
import { DocumentsBrwComponent } from '../entities/tenants/documents/documents.brw'
import { BulletinsBrwComponent } from '../entities/tenants/bulletins/bulletins.brw'
import { SettingsBrwComponent } from '../entities/tenants/settings/settings.brw'
import { FormsBrwComponent } from '../entities/tenants/forms/forms.brw'
import { FormFieldsBrwComponent } from '../entities/tenants/forms/formfields/formfields.brw'
import { FormResultsBrwComponent } from '../entities/tenants/forms/formresults/formresults.brw'
import { UsersBrwComponent } from '../entities/tenants/users/users.brw'
import { MessagesBrwComponent } from '../entities/tenants/messages/messages.brw'

const app_tenantRoutes: Routes = [
  { path: '', canActivate: [AuthGuard],
    children: [
      { path: 'properties', component: PropertiesBrwComponent },
      { path: 'organisations', component: OrganisationsBrwComponent },
      { path: 'employees', component: EmployeesBrwComponent },
      { path: 'images', component: ImagesBrwComponent },
      { path: 'documents', component: DocumentsBrwComponent },
      { path: 'bulletins', component: BulletinsBrwComponent },
      { path: 'settings', component: SettingsBrwComponent },
      { path: 'forms', component: FormsBrwComponent },
      { path: 'formfields', component: FormFieldsBrwComponent },
      { path: 'formresults', component: FormResultsBrwComponent },
      { path: 'messages', component: MessagesBrwComponent },
      { path: 'users', component: UsersBrwComponent },
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(app_tenantRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppTenantRoutingModule { }


