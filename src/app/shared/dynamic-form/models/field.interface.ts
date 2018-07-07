import { FormGroup } from '@angular/forms'
import { FieldConfig } from './field-config.interface'
import { MatDialogRef } from '@angular/material'
import { FormDialogComponent } from '../containers/form-dialog/form-dialog.component'

export interface Field {
  config: FieldConfig,
  group: FormGroup,
  onValueChg: Function,
  form: FormGroup,
  dialogRef: MatDialogRef<FormDialogComponent>
}
