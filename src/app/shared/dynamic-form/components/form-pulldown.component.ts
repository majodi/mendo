import { Component, Output, EventEmitter } from '@angular/core'
import { FormGroup } from '@angular/forms'

// Wrapper for pulldown custom component to work in dynamic form as dynamic field

import { Field } from '../models/field.interface'
import { FieldConfig } from '../models/field-config.interface'
import { MatDialogRef } from '@angular/material'
import { FormDialogComponent } from '../containers/form-dialog/form-dialog.component'

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'form-pulldown',
  template: `
    <div *ngIf="!config.hidden && !config.doNotPopulate" [formGroup]="group">
      <app-pulldown
      ngDefaultControl
      [isDisabled]="config.disabled"
      [dialogRef]="dialogRef"
      [value]="config.value"
      [formControlName]="config.name"
      [lookupPlaceholder]="config.placeholder"
      [lookupItems]="config.customLookupItems"
      (itemChosen)="valueChanged($event)">
      </app-pulldown>
    </div>
  `
})
export class FormPulldownComponent implements Field {
  config: FieldConfig
  group: FormGroup
  onValueChg: Function
  form: FormGroup
  dialogRef: MatDialogRef<FormDialogComponent>

  valueChanged(value) {
    this.config.customValueChg(this.config.name, value)
    this.config.value = value
  }

}
