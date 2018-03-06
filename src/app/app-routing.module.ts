import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TenantsBrwComponent } from './entities/tenants/tenants.brw';
import { ArticlesBrwComponent } from './entities/tenants/articles/articles.brw';
import { PropertiesBrwComponent } from './entities/tenants/properties/properties.brw';
import { CategoriesBrwComponent } from './entities/tenants/categories/categories.brw';
import { OrganisationsBrwComponent } from './entities/tenants/organisations/organisation.brw';
import { EmployeesBrwComponent } from './entities/tenants/organisations/employees/employees.brw';
import { ImagesBrwComponent } from './entities/tenants/images/images.brw';
import { OrdersBrwComponent } from './entities/tenants/orders/orders.brw';
import { SettingsBrwComponent } from './entities/tenants/settings/settings.brw';

import { StoreComponent } from './entities/tenants/store/store';

const routes: Routes = [
  { path: 'store', component: StoreComponent },
  { path: 'tenants', component: TenantsBrwComponent },
  { path: 'categories', component: CategoriesBrwComponent },
  { path: 'properties', component: PropertiesBrwComponent },
  { path: 'articles', component: ArticlesBrwComponent },
  { path: 'articles', component: ArticlesBrwComponent },
  { path: 'organisations', component: OrganisationsBrwComponent },
  { path: 'employees', component: EmployeesBrwComponent },
  { path: 'images', component: ImagesBrwComponent },
  { path: 'orders', component: OrdersBrwComponent },
  { path: 'settings', component: SettingsBrwComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
