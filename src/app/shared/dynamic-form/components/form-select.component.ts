import { Component } from '@angular/core'
import { FormGroup } from '@angular/forms'

import { Field } from '../models/field.interface'
import { FieldConfig } from '../models/field-config.interface'

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'form-select',
  template: `
    <mat-form-field *ngIf="!config.hidden && !config.doNotPopulate" [formGroup]="group" [floatLabel]="config.label">
      <mat-select [formControlName]="config.name" (selectionChange)="onSelectionChange($event)" [(ngModel)]="config.value">
        <mat-option *ngFor="let option of config.options" [value]="option">
          {{ option }}
        </mat-option>
      </mat-select>
      <mat-placeholder>{{ config.placeholder }}</mat-placeholder>
    </mat-form-field>
    <br>
  `
})
export class FormSelectComponent implements Field {
  config: FieldConfig
  group: FormGroup
  onValueChg: Function

  onSelectionChange(e) {
    this.config.value = e.value
    if (this.onValueChg !== undefined) { this.onValueChg(this.config.name, this.config.value) }
  }

}
