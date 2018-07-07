import { Component } from '@angular/core'
import { FormGroup } from '@angular/forms'

import { Field } from '../models/field.interface'
import { FieldConfig } from '../models/field-config.interface'
import { Observable } from 'rxjs'
import { MatDialogRef } from '@angular/material'
import { FormDialogComponent } from '../containers/form-dialog/form-dialog.component'

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'form-stringdisplay',
  template: `
  <div *ngIf="!config.hidden && !config.doNotPopulate">
    <p class="mat-title">{{config.label != "" && config.label != null ? config.label + ":" : ""}} <span class="mat-body-2">{{config.value}}</span></p>
  </div>
  `
})
export class FormStringdisplayComponent implements Field {
  config: FieldConfig
  group: FormGroup
  onValueChg: Function
  form: FormGroup
  dialogRef: MatDialogRef<FormDialogComponent>
}
