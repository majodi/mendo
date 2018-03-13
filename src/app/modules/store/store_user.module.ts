import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { SharedModule } from '../../shared/shared.module';
import { ArticlesBrwComponent } from '../../entities/tenants/articles/articles.brw';
import { OrdersBrwComponent } from '../../entities/tenants/orders/orders.brw';
import { OrderLinesBrwComponent } from '../../entities/tenants/orderlines/orderlines.brw';
import { StoreComponent } from '../../entities/tenants/store/store';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
    ],
  declarations: [
      ArticlesBrwComponent,
      OrdersBrwComponent,
      OrderLinesBrwComponent,
      StoreComponent,
    ],
  exports: [
      ArticlesBrwComponent,
      OrdersBrwComponent,
      OrderLinesBrwComponent,
      StoreComponent,
    ],
})
export class StoreUserModule { }
