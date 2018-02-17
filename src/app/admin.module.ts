import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TenantsBrwComponent } from './entities/tenants/tenants.brw';
import { ArticlesBrwComponent } from './entities/tenants/articles/articles.brw';
import { PropertiesBrwComponent } from './entities/tenants/properties/properties.brw';
import { CategoriesBrwComponent } from './entities/tenants/categories/categories.brw';
import { SharedModule } from './shared/shared.module';
import { CustomComponentsModule } from './shared/custom-components/custom-components.module';
import { DynamicFormModule } from './shared/dynamic-form/dynamic-form.module';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      CustomComponentsModule,
      DynamicFormModule,
    ],
  declarations: [
      TenantsBrwComponent,
      ArticlesBrwComponent,
      PropertiesBrwComponent,
      CategoriesBrwComponent,
    ],
  exports: [
      TenantsBrwComponent,
      ArticlesBrwComponent,
      PropertiesBrwComponent,
      CategoriesBrwComponent,
    ],
})
export class AdminModule { }
