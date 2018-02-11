import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

// Wrapper for pulldown custom component to work in dynamic form as dynamic field

import { Field } from '../models/field.interface';
import { FieldConfig } from '../models/field-config.interface';

@Component({
  selector: 'form-pulldown',
  template: `
    <div [formGroup]="group">
      <app-pulldown ngDefaultControl [isDisabled]="config.disabled" [formControlName]="config.name" [lookupPlaceholder]="config.placeholder" [lookupItems$]="config.customLookupItems$" (itemChosen)="valueChanged($event)"></app-pulldown>
    </div>
  `
})
export class FormChiplistComponent implements Field {
  config: FieldConfig;
  group: FormGroup;

  valueChanged(value) {
    this.config.customValueChg(this.config.name, value)
    this.config.value = value
  }

}
