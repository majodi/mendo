import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    template: `
    <p class="mat-title">{{data.text}}</p>
    <br><br>
    <button mat-button (click)="dialogRef.close(1)">{{data.but1}}</button>
    <button mat-button (click)="dialogRef.close(2)">{{data.but2}}</button>
    `,
  })
  export class PopupDialog {constructor(public dialogRef: MatDialogRef<PopupDialog>, @Inject(MAT_DIALOG_DATA) public data: any) { }}
  