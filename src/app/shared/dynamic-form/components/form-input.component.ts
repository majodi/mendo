import { Component, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../models/field.interface';
import { FieldConfig } from '../models/field-config.interface';

@Component({
  selector: 'form-input',
  template: `
  <mat-form-field *ngIf="!config.doNotPopulate" style="width:100%" [formGroup]="group">
  <ng-container *ngIf="!config.inputLines; then input_tpl else textarea_tpl"></ng-container>
  <ng-template #input_tpl>
    <input
      matInput
      [type]="getOverruleType()"
      (keyup)="onKeyUp($event)"
      (blur)="onBlur($event)"
      [placeholder]="config.placeholder"
      [formControlName]="config.name"
      [readonly]="config.readOnly">
  </ng-template>
  <ng-template #textarea_tpl>
    <textarea
      matInput
      type="text"
      [rows]="config.inputLines"
      (keyup)="onKeyUp($event)"
      (blur)="onBlur($event)"
      [placeholder]="config.placeholder"
      [formControlName]="config.name"
      [readonly]="config.readOnly"></textarea>
  </ng-template>
  </mat-form-field>
  `
})
export class FormInputComponent implements Field {
  config: FieldConfig;
  group: FormGroup;
  onValueChg: Function;

  onKeyUp(e) {
    if(this.config.inputValueTransform != undefined){
      e.target.value = this.config.inputValueTransform(e.target.value)
      this.config.value = e.target.value
    }
  }

  getOverruleType() {
    if(this.config.inputType != undefined) {
      if(['number','password','date','email'].includes(this.config.inputType)){
        return this.config.inputType
      }
    }
  }

  onBlur(e) { //input not included in customValueChg, so after blur
    this.config.value = e.target.value
    if(this.onValueChg != undefined) this.onValueChg(this.config.name, this.config.value);
  }

}
