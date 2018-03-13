import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { CategoriesBrwComponent } from '../../entities/tenants/categories/categories.brw';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
    ],
  declarations: [
      CategoriesBrwComponent,
    ],
  exports: [
      CategoriesBrwComponent,
    ],
})
export class StoreTenantModule { }
