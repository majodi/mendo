import { Component } from '@angular/core'
import { FormGroup } from '@angular/forms'

import { Field } from '../models/field.interface'
import { FieldConfig } from '../models/field-config.interface'
import { MatDialogRef } from '@angular/material'
import { FormDialogComponent } from '../containers/form-dialog/form-dialog.component'

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'form-select',
  template: `
  <div *ngIf="!config.hidden && !config.doNotPopulate" [formGroup]="group">
    <mat-form-field [floatLabel]="config.label">
      <mat-select [formControlName]="config.name" (selectionChange)="onSelectionChange($event)" [(ngModel)]="config.value">
        <mat-option *ngFor="let option of config.options" [value]="option">
          {{ option }}
        </mat-option>
      </mat-select>
      <mat-placeholder>{{ config.placeholder }}</mat-placeholder>
    </mat-form-field>
    <mat-icon (click)="clearValue()" style="vertical-align: middle">clear</mat-icon>
    <br>
  </div>
  `
})
export class FormSelectComponent implements Field {
  config: FieldConfig
  group: FormGroup
  onValueChg: Function
  form: FormGroup
  dialogRef: MatDialogRef<FormDialogComponent>

  onSelectionChange(e) {
    this.config.value = e.value
    if (this.onValueChg !== undefined) { this.onValueChg(this.config.name, this.config.value) }
  }

  clearValue() {
    this.config.value = undefined
  }

}
