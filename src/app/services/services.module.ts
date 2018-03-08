import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from './auth.service';
import { DbService } from './db.service';
import { GlobService } from './glob.service';
import { PopupService } from './popup.service';
import { UploadService } from './upload.service';
import { CrudService } from './crud.service';

import { MatDialogRef } from '@angular/material';
const matDialogRefStub = {}; //vage oplossing (zie google) om foutmelding te voorkomen

@NgModule({
  imports: [],
  providers: [AuthService, DbService, GlobService, PopupService, UploadService, CrudService, {provide: MatDialogRef, useValue: matDialogRefStub}],
})
export class ServicesModule { }
