import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TenantsBrwComponent } from './entities/tenants/tenants.brw';
import { ArticlesBrwComponent } from './entities/tenants/articles/articles.brw';
import { PropertiesBrwComponent } from './entities/tenants/properties/properties.brw';
import { CategoriesBrwComponent } from './entities/tenants/categories/categories.brw';
import { OrganisationsBrwComponent } from './entities/tenants/organisations/organisation.brw';
import { EmployeesBrwComponent } from './entities/tenants/organisations/employees/employees.brw';
import { ImagesBrwComponent } from './entities/tenants/images/images.brw';
import { OrdersBrwComponent } from './entities/tenants/orders/orders.brw';
import { OrderLinesBrwComponent } from './entities/tenants/orderlines/orderlines.brw';
import { SettingsBrwComponent } from './entities/tenants/settings/settings.brw';

import { SharedModule } from './shared/shared.module';
import { CustomComponentsModule } from './shared/custom-components/custom-components.module';
import { DynamicFormModule } from './shared/dynamic-form/dynamic-form.module';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      FlexLayoutModule,
      CustomComponentsModule,
      DynamicFormModule,
    ],
  declarations: [
      TenantsBrwComponent,
      ArticlesBrwComponent,
      PropertiesBrwComponent,
      CategoriesBrwComponent,
      OrganisationsBrwComponent,
      EmployeesBrwComponent,
      ImagesBrwComponent,
      OrdersBrwComponent,
      OrderLinesBrwComponent,
      SettingsBrwComponent,
    ],
  exports: [
      TenantsBrwComponent,
      ArticlesBrwComponent,
      PropertiesBrwComponent,
      CategoriesBrwComponent,
      OrganisationsBrwComponent,
      EmployeesBrwComponent,
      ImagesBrwComponent,
      OrdersBrwComponent,
      OrderLinesBrwComponent,
      SettingsBrwComponent,
    ],
})
export class AdminModule { }
