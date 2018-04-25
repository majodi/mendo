import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';

@Component({
    template: `
    <p class="mat-title" style="white-space: pre-line">{{data.text}}</p>
    <br><br>
    <p *ngIf="data.field != undefined" class="mat-title" style="white-space: pre-line">{{data.field.label}}</p>    
    <input *ngIf="data.field != undefined" matInput [(ngModel)]="data.field.value" [placeholder]="data.field.placeholder">
    <br><br>
    <button mat-button (click)="dialogRef.close(1)">{{data.but1}}</button>
    <button mat-button (click)="dialogRef.close(2)">{{data.but2}}</button>
    <button *ngIf="data.copyToClipboard" mat-button (click)="copyToClipboard(data.copyToClipboard)">Kopieer naar klembord</button>
    `,
  })
  export class PopupDialog {
    constructor(
      public dialogRef: MatDialogRef<PopupDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public snackBar: MatSnackBar
    ) {}

  copyToClipboard(toCopy) {
    let element = document.createElement('textarea')
    element.value = toCopy
    document.body.appendChild(element)
    element.focus()
    element.setSelectionRange(0, element.value.length)
    document.execCommand('copy')
    document.body.removeChild(element)
    let snackBarRef = this.snackBar.open('Naar klembord gekopieerd', 'Gezien')
  }

}
  