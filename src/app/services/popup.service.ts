import { Component, Injectable } from '@angular/core';
import {MatDialog} from '@angular/material';
import { PopupDialog } from '../shared/popupdialog.component';

@Injectable()
export class PopupService {
  
    constructor(private dialog: MatDialog) { }

    buttonDialog(text, button1, button2?) {
      let dialogRef = this.dialog.open(PopupDialog, {
        width: '250px',
        data: { text: text, but1: button1, but2: button2 }
      });
  
      return dialogRef.afterClosed().toPromise().then(result => {
        console.log('Popup dialog was closed with result', result)
        return result
      });
    }
  
  }
