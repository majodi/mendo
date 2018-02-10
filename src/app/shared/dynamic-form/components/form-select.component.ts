import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../models/field.interface';
import { FieldConfig } from '../models/field-config.interface';

@Component({
  selector: 'form-select',
  template: `
    <mat-form-field [formGroup]="group" [floatLabel]="config.label">
      <mat-select [formControlName]="config.name">
        <mat-option *ngFor="let option of config.options" [value]="option">
          {{ option }}
        </mat-option>
      </mat-select>
      <mat-placeholder>{{ config.placeholder }}</mat-placeholder>
    </mat-form-field>
  `
})
export class FormSelectComponent implements Field {
  config: FieldConfig;
  group: FormGroup;
}
