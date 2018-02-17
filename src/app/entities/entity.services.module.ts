import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

import { TenantService } from './tenants/tenant.service';
import { ArticleService } from './tenants/articles/article.service';
import { PropertyService } from './tenants/properties/property.service';
import { CategoryService } from './tenants/categories/category.service';

@NgModule({
  imports: [],
  providers: [TenantService, ArticleService, PropertyService, CategoryService],
})
export class EntityServicesModule { }
