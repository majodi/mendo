import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

import { TenantService } from './tenants/tenant.service';
import { ArticleService } from './tenants/articles/article.service';
import { PropertyService } from './tenants/properties/property.service';
import { CategoryService } from './tenants/categories/category.service';
import { OrganisationService } from './tenants/organisations/organisation.service';
import { EmployeeService } from './tenants/organisations/employees/employee.service';
import { ImageService } from './tenants/images/image.service';
import { OrderService } from './tenants/orders/order.service';
import { OrderLineService } from './tenants/orderlines/orderline.service';
import { SettingService } from './tenants/settings/setting.service';

@NgModule({
  imports: [],
  providers: [
    TenantService,
    ArticleService,PropertyService,
    CategoryService,
    OrganisationService,
    EmployeeService,
    ImageService,
    OrderService,
    OrderLineService,
    SettingService
  ],
})
export class EntityServicesModule { }
