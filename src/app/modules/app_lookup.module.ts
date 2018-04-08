import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatDialogModule, MatButtonModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '../shared/shared.module';

import { ImagesBrwComponent } from '../entities/tenants/images/images.brw';
import { ImageService } from '../entities/tenants/images/image.service';
import { EmployeesBrwComponent } from '../entities/tenants/organisations/employees/employees.brw';
import { EmployeeService } from '../entities/tenants/organisations/employees/employee.service';
import { OrganisationService } from '../entities/tenants/organisations/organisation.service';

import { OrdersBrwComponent } from '../entities/tenants/orders/orders.brw';
import { OrderService } from '../entities/tenants/orders/order.service';
import { ArticlesBrwComponent } from '../entities/tenants/articles/articles.brw';
import { ArticleService } from '../entities/tenants/articles/article.service';
import { CategoryService } from '../entities/tenants/categories/category.service';
import { PropertyService } from '../entities/tenants/properties/property.service';
import { CartComponent } from '../entities/tenants/store/cart';
import { OrderLineService } from '../entities/tenants/orderlines/orderline.service';
import { UsersBrwComponent } from '../entities/tenants/users/users.brw';
import { UserService } from '../entities/tenants/users/user.service';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      FlexLayoutModule,
      MatDialogModule, MatButtonModule,
    ],
  declarations: [
      ImagesBrwComponent,
      EmployeesBrwComponent,
      OrdersBrwComponent,
      ArticlesBrwComponent,
      CartComponent,
      UsersBrwComponent,
    ],
  exports: [
      ImagesBrwComponent,
      EmployeesBrwComponent,
      OrdersBrwComponent,
      ArticlesBrwComponent,
      CartComponent,
      UsersBrwComponent,
    ],
  providers: [
      ImageService,
      EmployeeService,
      OrganisationService,
      OrderService,
      ArticleService,
      CategoryService,
      PropertyService,
      OrderLineService,
      UserService,
    ]
})
export class AppLookupModule { }
