import { Component } from '@angular/core'
import { FormGroup } from '@angular/forms'

import { Field } from '../models/field.interface'
import { FieldConfig } from '../models/field-config.interface'
import { MatDialogRef } from '@angular/material'
import { FormDialogComponent } from '../containers/form-dialog/form-dialog.component'

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'form-button',
  template: `
  <div
    class="dynamic-field form-button"
    [formGroup]="group">
    <button mat-button
      (click)="buttonClick($event)"
      [disabled]="config.disabled"
      type="button">
      {{ config.label }}
    </button>
  </div>
`
})
export class FormButtonComponent implements Field {
  config: FieldConfig
  group: FormGroup
  onValueChg: Function
  form: FormGroup
  dialogRef: MatDialogRef<FormDialogComponent>

  buttonClick(e) {
    if (this.config.buttonClick !== undefined) {
      this.config.buttonClick(e) // call function in form context (where funct was defined)
    }
  }
}
