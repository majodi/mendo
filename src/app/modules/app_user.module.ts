import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { SharedModule } from '../shared/shared.module';
import { HomePageComponent } from '../homepage';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
    ],
  declarations: [
      HomePageComponent,
    ],
  exports: [
      HomePageComponent,
    ],
})
export class AppUserModule { }
