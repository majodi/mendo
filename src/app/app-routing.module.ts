import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TenantsBrwComponent } from './entities/tenants/tenants.brw';
import { ArticlesBrwComponent } from './entities/tenants/articles/articles.brw';
import { PropertiesBrwComponent } from './entities/tenants/properties/properties.brw';
import { CategoriesBrwComponent } from './entities/tenants/categories/categories.brw';
import {  } from './entities/tenants/categories/categories.brw';

const routes: Routes = [
  { path: 'tenants', component: TenantsBrwComponent },
  { path: 'categories', component: CategoriesBrwComponent },
  { path: 'properties', component: PropertiesBrwComponent },
  { path: 'articles', component: ArticlesBrwComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
