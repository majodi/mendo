import { Component, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

import { PopupDialog } from '../shared/custom-components/components/popupdialog.component';
import { FormDialogComponent } from '../shared/dynamic-form/containers/form-dialog/form-dialog.component';
import { FieldConfig } from '../shared/dynamic-form/models/field-config.interface';

@Injectable()
export class PopupService {
  
    constructor(private dialog: MatDialog) { }

    buttonDialog(text, button1, button2?) {
      let dialogRef = this.dialog.open(PopupDialog, {
        width: '250px',
        data: { text: text, but1: button1, but2: button2 }
      });
  
      return dialogRef.afterClosed().toPromise().then(result => {
        return result
      });
    }

    formDialog(action: number, fieldConfig: FieldConfig[], formRecord: {}) {
      let dialogRef = this.dialog.open(FormDialogComponent, {
        width: '800px',
        data: { action: action, fieldConfig: fieldConfig, formRecord: formRecord}
      });

      return dialogRef.afterClosed().toPromise().then(result => {
        return result
      });
    }
  
  }
