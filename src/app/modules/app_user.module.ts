import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { SharedModule } from '../shared/shared.module';
import { WaitOnAuthComponent } from '../wait-on-auth.component';
import { HomePageComponent } from '../homepage';
import { BulletinService } from '../entities/tenants/bulletins/bulletin.service';
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
    ]
})
export class AppUserModule { }
