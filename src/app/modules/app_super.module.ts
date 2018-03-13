import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { SharedModule } from '../shared/shared.module';
import { TenantsBrwComponent } from '../entities/tenants/tenants.brw';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
    ],
  declarations: [
      TenantsBrwComponent,
    ],
  exports: [
      TenantsBrwComponent,
    ],
})
export class AppSuperModule { }
