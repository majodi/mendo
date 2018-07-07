import { Component, Output, EventEmitter } from '@angular/core'
import { FormGroup } from '@angular/forms'

// Wrapper for filepick custom component to work in dynamic form as dynamic field

import { Field } from '../models/field.interface'
import { FieldConfig } from '../models/field-config.interface'
import { MatDialogRef } from '@angular/material'
import { FormDialogComponent } from '../containers/form-dialog/form-dialog.component'

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'form-filepick',
  template: `
    <div [formGroup]="group">
      <app-filepick ngDefaultControl [isDisabled]="config.disabled" [value]="config.value" [formControlName]="config.name" [placeholder]="config.placeholder" (picked)="filePicked($event)"></app-filepick>
    </div>
  `
})
export class FormFilepickComponent implements Field {
  config: FieldConfig
  group: FormGroup
  onValueChg: Function
  form: FormGroup
  dialogRef: MatDialogRef<FormDialogComponent>

  filePicked(file) {
    this.config.customFile = file
    this.config.value = file.name
    this.config.customValueChg(this.config.name, file.name)
  }

}
