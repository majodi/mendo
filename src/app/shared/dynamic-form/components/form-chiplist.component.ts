import { Component, Output, EventEmitter } from '@angular/core'
import { FormGroup } from '@angular/forms'

// Wrapper for chiplist custom component to work in dynamic form as dynamic field

import { Field } from '../models/field.interface'
import { FieldConfig } from '../models/field-config.interface'

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'form-chiplist',
  template: `
    <div *ngIf="!config.hidden && !config.doNotPopulate" [formGroup]="group">
      <app-chiplist
      ngDefaultControl
      [isDisabled]="config.disabled"
      [formControlName]="config.name"
      [placeholder]="config.placeholder"
      [tagList]="config.value"
      [tagOptions]="config.options"
      (tagListChange)="valueChanged($event)">
      </app-chiplist>
    </div>
  `
})
export class FormChiplistComponent implements Field {
  config: FieldConfig
  group: FormGroup
  onValueChg: Function

  valueChanged(value) {
    this.config.customValueChg(this.config.name, value)
    this.config.value = value
  }

}
