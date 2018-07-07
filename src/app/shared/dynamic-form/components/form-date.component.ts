import { Component } from '@angular/core'
import { FormGroup } from '@angular/forms'

import { Field } from '../models/field.interface'
import { FieldConfig } from '../models/field-config.interface'
import { MatDialogRef } from '@angular/material'
import { FormDialogComponent } from '../containers/form-dialog/form-dialog.component'

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'form-date',
  template: `
    <mat-form-field *ngIf="!config.hidden && !config.doNotPopulate" [formGroup]="group" [floatLabel]="config.label">
      <input matInput [formControlName]="config.name" [matDatepicker]="picker" [placeholder]="config.placeholder" (dateChange)="onChange($event)" [(ngModel)]="config.value">
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
  `
})
export class FormDateComponent implements Field {
  config: FieldConfig
  group: FormGroup
  onValueChg: Function
  form: FormGroup
  dialogRef: MatDialogRef<FormDialogComponent>

  onChange(e) { // input not included in customValueChg, so after blur
    this.config.value = typeof e.target.value === 'string' ? new Date(e.target.value) : e.target.value
    if (this.onValueChg !== undefined) { this.onValueChg(this.config.name, this.config.value) }
  }

}
