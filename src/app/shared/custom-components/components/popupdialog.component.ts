import { Component, Inject, ViewChild, ElementRef, OnInit } from '@angular/core'
import {MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material'

@Component({
    template: `
    <div #htmlcontent></div>
    <p class="mat-title" style="white-space: pre-line">{{data.text}}</p>
    <br><br>
    <p *ngIf="data.field != undefined" class="mat-title" style="white-space: pre-line">{{data.field.label}}</p>
    <input *ngIf="data.field != undefined" matInput [(ngModel)]="data.field.value" [placeholder]="data.field.placeholder">
    <br><br>
    <button mat-button (click)="dialogRef.close(1)">{{data.but1}}</button>
    <button mat-button (click)="dialogRef.close(2)">{{data.but2}}</button>
    <button *ngIf="data.url" mat-button (click)="thisWindow.open(data.url, '_blank', 'top=0,left=0,height=100%,width=auto')">Download</button>
    <button *ngIf="data.copyToClipboard" mat-button (click)="copyToClipboard(data.copyToClipboard)">Kopieer naar klembord</button>
    `,
  })
  // tslint:disable-next-line:component-class-suffix
  export class PopupDialog implements OnInit {
    @ViewChild('htmlcontent') private htmlAreaRef: ElementRef
    thisWindow = window

    constructor(
      public dialogRef: MatDialogRef<PopupDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public snackBar: MatSnackBar
    ) {}

    ngOnInit() {
      if (this.data.htmlContent) {
        this.htmlAreaRef.nativeElement.innerHTML = this.data.htmlContent
      }
    }

  copyToClipboard(toCopy) {
    const element = document.createElement('textarea')
    element.value = toCopy
    document.body.appendChild(element)
    element.focus()
    element.setSelectionRange(0, element.value.length)
    document.execCommand('copy')
    document.body.removeChild(element)
    const snackBarRef = this.snackBar.open('Naar klembord gekopieerd', 'Gezien')
  }

}
