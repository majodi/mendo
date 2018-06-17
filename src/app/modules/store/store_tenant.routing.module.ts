import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { AuthGuard } from '../../auth-guard.service'
import { CategoriesBrwComponent } from '../../entities/tenants/categories/categories.brw'
import { ArticlesBrwComponent } from '../../entities/tenants/articles/articles.brw'
import { OrdersBrwComponent } from '../../entities/tenants/orders/orders.brw'
import { OrderLinesBrwComponent } from '../../entities/tenants/orderlines/orderlines.brw'

const store_tenantRoutes: Routes = [
  { path: '', canActivate: [AuthGuard],
    children: [
      { path: 'categories', component: CategoriesBrwComponent },
      { path: 'articles', component: ArticlesBrwComponent },
      { path: 'orders', component: OrdersBrwComponent },
      { path: 'orderlines', component: OrderLinesBrwComponent },
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(store_tenantRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class StoreTenantRoutingModule { }
