import { Component, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../models/field.interface';
import { FieldConfig } from '../models/field-config.interface';

@Component({
  selector: 'form-input',
  template: `
  <mat-form-field style="width:100%" [formGroup]="group">
    <input
      matInput
      type="text"
      (keyup)="onKeyUp($event)"
      [placeholder]="config.placeholder"
      [formControlName]="config.name">
  </mat-form-field>
  `
})
export class FormInputComponent implements Field {
  config: FieldConfig;
  group: FormGroup;

  onKeyUp(e) {
    if(this.config.inputValueTransform != undefined){
      e.target.value = this.config.inputValueTransform(e.target.value)
      this.config.value = e.target.value
    }
  }

}
