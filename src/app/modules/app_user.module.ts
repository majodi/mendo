import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { SharedModule } from '../shared/shared.module';
import { WaitOnAuthComponent } from '../wait-on-auth.component';
import { HomePageComponent } from '../homepage';
import { BulletinService } from '../entities/tenants/bulletins/bulletin.service';
import { FormService } from '../entities/tenants/forms/form.service';
import { FormFieldService } from '../entities/tenants/forms/formfields/formfield.service';
import { FormResultService } from '../entities/tenants/forms/formresults/formresult.service';
import { AppUserRoutingModule } from './app_user.routing.module';

import { AuthGuard } from '../auth-guard.service';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      AppUserRoutingModule,
    ],
  declarations: [
      WaitOnAuthComponent,
      HomePageComponent,
    ],
  exports: [
      WaitOnAuthComponent,
      HomePageComponent,
    ],
  providers: [
      AuthGuard,
      BulletinService,
      FormService,
      FormFieldService,
      FormResultService,
    ]
})
export class AppUserModule { }
