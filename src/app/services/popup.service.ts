import { Injectable, Type } from '@angular/core';
import { MatDialog } from '@angular/material';

import { PopupDialog } from '../shared/custom-components/components/popupdialog.component';
import { FormDialogComponent } from '../shared/dynamic-form/containers/form-dialog/form-dialog.component';
import { FieldConfig } from '../shared/dynamic-form/models/field-config.interface';
import { BrowseDialogComponent } from '../shared/dynamic-form/containers/browse-dialog/browse-dialog.component';

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

    formDialog(action: number, fieldConfig: FieldConfig[], formRecord: {}, onValueChg?: Function) {
      let dialogRef = this.dialog.open(FormDialogComponent, {
        width: '800px',
        data: { action: action, fieldConfig: fieldConfig, formRecord: formRecord, onValueChg: onValueChg}
      });

      return dialogRef.afterClosed().toPromise().then(result => {
        return result
      });
    }

    BrowseDialog(brwComponent: Type<any>) {
      let dialogRef = this.dialog.open(brwComponent, {
        width: '1000px',
        data: {}
      });
      dialogRef.componentInstance.select = true

      return dialogRef.afterClosed().toPromise().then(result => {
        return result
      });
    }
    
  }
