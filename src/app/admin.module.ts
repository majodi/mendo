import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TenantsBrwComponent } from './entities/tenants/brw/tenants.brw';
import { SharedModule } from './shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      SharedModule
    ],
  declarations: [
      TenantsBrwComponent,
    ],
  exports: [
      TenantsBrwComponent,
    ],
})
export class AdminModule { }
