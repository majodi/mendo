import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { SharedModule } from '../shared/shared.module';
import { HomePageComponent } from '../homepage';
import { BulletinsBrwComponent } from '../entities/tenants/bulletins/bulletins.brw';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
    ],
  declarations: [
      HomePageComponent,
      BulletinsBrwComponent,
    ],
  exports: [
      HomePageComponent,
      BulletinsBrwComponent,
    ],
})
export class AppUserModule { }
