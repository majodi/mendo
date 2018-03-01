import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreComponent } from './entities/tenants/store/store';

import { SharedModule } from './shared/shared.module';
import { CustomComponentsModule } from './shared/custom-components/custom-components.module';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      CustomComponentsModule,
    ],
  declarations: [
      StoreComponent,
    ],
  exports: [
      StoreComponent
    ],
})
export class UserModule { }
