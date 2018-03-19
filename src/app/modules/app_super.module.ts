import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { SharedModule } from '../shared/shared.module';
import { TenantsBrwComponent } from '../entities/tenants/tenants.brw';
import { TenantService } from '../entities/tenants/tenant.service';
import { AppSuperRoutingModule } from './app_super.routing.module';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      AppSuperRoutingModule,
    ],
  declarations: [
      TenantsBrwComponent,
    ],
  exports: [
      TenantsBrwComponent,
    ],
    providers: [
      TenantService,
    ]
})
export class AppSuperModule { }
