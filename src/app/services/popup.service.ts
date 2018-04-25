import { Injectable, Type } from '@angular/core';
import { MatDialog } from '@angular/material';

import { PopupDialog } from '../shared/custom-components/components/popupdialog.component';
import { FormDialogComponent } from '../shared/dynamic-form/containers/form-dialog/form-dialog.component';
import { FieldConfig } from '../shared/dynamic-form/models/field-config.interface';
import { QueryItem } from '../models/query-item.interface';
import { GlobService } from './glob.service';

@Injectable()
export class PopupService {
  
    constructor(private dialog: MatDialog, private gs: GlobService) { }

    buttonDialog(text, button1, button2?, field?, copyToClipboard?) {
      let dialogRef = this.dialog.open(PopupDialog, {
        width: '250px',
        data: { text: text, but1: button1, but2: button2, field: field, copyToClipboard: copyToClipboard}
      });
  
      return dialogRef.afterClosed().toPromise().then(result => {
        return result
      });
    }

    formDialog(action: number, fieldConfig: FieldConfig[], formRecord: {}, onValueChg?: Function, alternativeFormActionTitle?: string) {
      let dialogRef = this.dialog.open(FormDialogComponent, {
        width: '800px',
        data: { action: action, fieldConfig: fieldConfig, formRecord: formRecord, onValueChg: onValueChg, alternativeFormActionTitle: alternativeFormActionTitle}
      });

      return dialogRef.afterClosed().toPromise().then(result => {
        return result
      });
    }

    BrowseDialog(brwComponent: Type<any>, selectMode?: boolean, soberMode?: boolean, query?: QueryItem[], itemSelect?: boolean, itemSelectParent?: string, itemSelectEntity?: string) {
      if(query != undefined){
        query.forEach(q => {
          this.gs.NavQueries.push({fld: q.fld, operator: q.operator, value: q.value})
        })
        this.gs.NavQueriesRead = false
      }
      let dialogRef = this.dialog.open(brwComponent, {
        width: '1000px',
        data: {}
      });
      if(selectMode != undefined){
        dialogRef.componentInstance.select = selectMode  
      } else dialogRef.componentInstance.select = true;
      if(soberMode != undefined){
        dialogRef.componentInstance.sober = soberMode  
      } else dialogRef.componentInstance.sober = false;
      if(itemSelect != undefined){
        dialogRef.componentInstance.itemSelect = itemSelect  
      } else dialogRef.componentInstance.itemSelect = false;      
      dialogRef.componentInstance.itemSelectParent = itemSelectParent
      dialogRef.componentInstance.itemSelectEntity = itemSelectEntity

      return dialogRef.afterClosed().toPromise().then(result => {
        if(query != undefined){
          this.gs.NavQueries = []
        }
        return result
      });
    }
    
  }
