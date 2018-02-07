import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from './auth.service';
import { DbService } from './db.service';
import { GlobService } from './glob.service';
//import {  } from './guard.service';
import { PopupService } from './popup.service';

@NgModule({
  imports: [],
  providers: [AuthService, DbService, GlobService, PopupService],
})
export class ServicesModule { }
