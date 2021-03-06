import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { SharedModule } from '../shared/shared.module'
import { PropertiesBrwComponent } from '../entities/tenants/properties/properties.brw'
import { PropertyService } from '../entities/tenants/properties/property.service'
import { OrganisationsBrwComponent } from '../entities/tenants/organisations/organisation.brw'
import { OrganisationService } from '../entities/tenants/organisations/organisation.service'
import { EmployeesBrwComponent } from '../entities/tenants/organisations/employees/employees.brw'
import { EmployeeService } from '../entities/tenants/organisations/employees/employee.service'
import { ImagesBrwComponent } from '../entities/tenants/images/images.brw'
import { DocumentsBrwComponent } from '../entities/tenants/documents/documents.brw'
import { ImageService } from '../entities/tenants/images/image.service'
import { DocumentService } from '../entities/tenants/documents/document.service'
import { SettingsBrwComponent } from '../entities/tenants/settings/settings.brw'
import { SettingService } from '../entities/tenants/settings/setting.service'
import { BulletinsBrwComponent } from '../entities/tenants/bulletins/bulletins.brw'
import { FormsBrwComponent } from '../entities/tenants/forms/forms.brw'
import { FormFieldsBrwComponent } from '../entities/tenants/forms/formfields/formfields.brw'
import { FormResultsBrwComponent } from '../entities/tenants/forms/formresults/formresults.brw'
import { MessagesBrwComponent } from '../entities/tenants/messages/messages.brw'
import { MessageService } from '../entities/tenants/messages/message.service'

import { OrdersBrwComponent } from '../entities/tenants/orders/orders.brw'

import { AppTenantRoutingModule } from './app_tenant.routing.module'
import { AppLookupModule } from './app_lookup.module'

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      AppLookupModule,
      AppTenantRoutingModule,
    ],
  declarations: [
      PropertiesBrwComponent,
      OrganisationsBrwComponent,
      BulletinsBrwComponent,
      SettingsBrwComponent,
      FormsBrwComponent,
      FormFieldsBrwComponent,
      FormResultsBrwComponent,
      MessagesBrwComponent,
    ],
  exports: [
      PropertiesBrwComponent,
      OrganisationsBrwComponent,
      BulletinsBrwComponent,
      SettingsBrwComponent,
      FormsBrwComponent,
      FormFieldsBrwComponent,
      FormResultsBrwComponent,
      MessagesBrwComponent,
    ],
    entryComponents: [DocumentsBrwComponent, ImagesBrwComponent, EmployeesBrwComponent, OrdersBrwComponent],
    providers: [
      PropertyService,
      // OrganisationService,
      // EmployeeService,
      // ImageService,
      SettingService,
      MessageService,
    ]
})
export class AppTenantModule { }
