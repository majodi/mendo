import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TenantsBrwComponent } from './entities/tenants/brw/tenants.brw';
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
    ],
  exports: [
      TenantsBrwComponent,
    ],
})
export class AdminModule { }
