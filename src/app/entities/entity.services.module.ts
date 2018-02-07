import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

import { TenantService } from './tenants/tenant.service';

@NgModule({
  imports: [],
  providers: [TenantService],
})
export class EntityServicesModule { }
