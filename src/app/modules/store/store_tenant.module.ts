import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { CategoriesBrwComponent } from '../../entities/tenants/categories/categories.brw';
import { ArticlesBrwComponent } from '../../entities/tenants/articles/articles.brw';
import { OrdersBrwComponent } from '../../entities/tenants/orders/orders.brw';
import { OrderService } from '../../entities/tenants/orders/order.service';
import { OrderLinesBrwComponent } from '../../entities/tenants/orderlines/orderlines.brw';
import { OrderLineService } from '../../entities/tenants/orderlines/orderline.service';
import { StoreTenantRoutingModule } from './store_tenant.routing.module';
import { CategoryService } from '../../entities/tenants/categories/category.service';
import { ArticleService } from '../../entities/tenants/articles/article.service';
import { PropertyService } from '../../entities/tenants/properties/property.service';
import { OrganisationService } from '../../entities/tenants/organisations/organisation.service';
import { EmployeeService } from '../../entities/tenants/organisations/employees/employee.service';

import { AppLookupModule } from '../app_lookup.module';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      AppLookupModule,
      StoreTenantRoutingModule,
    ],
  declarations: [
      CategoriesBrwComponent,
      ArticlesBrwComponent,
      // OrdersBrwComponent,
      OrderLinesBrwComponent,
    ],
  exports: [
      CategoriesBrwComponent,
      ArticlesBrwComponent,
      // OrdersBrwComponent,
      OrderLinesBrwComponent,
    ],
  entryComponents: [OrdersBrwComponent],
  providers: [
      CategoryService,
      ArticleService,
      PropertyService,
      OrganisationService,
      EmployeeService,
      OrderService,
      OrderLineService,
    ]    
})
export class StoreTenantModule { }
