import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';

import { StoreComponent } from './entities/tenants/store/store';
import { HomePageComponent } from './homepage';

import { SharedModule } from './shared/shared.module';
import { CustomComponentsModule } from './shared/custom-components/custom-components.module';

@NgModule({
  imports: [
      CommonModule,
      MatButtonModule,
      SharedModule,
      CustomComponentsModule,
    ],
  declarations: [
      StoreComponent,
      HomePageComponent,
    ],
  exports: [
      StoreComponent,
      HomePageComponent,
    ],
})
export class UserModule { }
