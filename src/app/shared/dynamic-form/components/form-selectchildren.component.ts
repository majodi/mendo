import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../models/field.interface';
import { FieldConfig } from '../models/field-config.interface';

@Component({
  selector: 'form-selectchildren',
  template: `
<div *ngIf="!config.hidden && !config.doNotPopulate" [formGroup]="group">
  <app-selectchildren
    ngDefaultControl
    [label]="config.label"
    [checked]="config.value"
    [selectionComponent]="config.customSelectChildrenComponent"
    [selectionParent]="config.customSelectChildrenCurrentParent"
    [isDisabled]="config.disabled"
    [formControlName]="config.name"
    (checkChange)="valueChanged($event)"
  ></app-selectchildren>
  <br>
</div>
`
})
export class FormSelectChildrenComponent implements Field {
  config: FieldConfig;
  group: FormGroup;
  onValueChg: Function;

  valueChanged(value) {
    this.config.value = value
    if(this.onValueChg != undefined) this.onValueChg(this.config.name, this.config.value);
  }
  
}
