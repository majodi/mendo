import { Component } from '@angular/core'
import { FormGroup } from '@angular/forms'

import { Field } from '../models/field.interface'
import { FieldConfig } from '../models/field-config.interface'
import { MatDialogRef } from '@angular/material'
import { FormDialogComponent } from '../containers/form-dialog/form-dialog.component'

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'form-lookup',
  template: `
<div *ngIf="!config.hidden && !config.doNotPopulate" [formGroup]="group">
  <app-lookup
    ngDefaultControl
    [lookupComponent]="config.customLookupComponent"
    [lookupPlaceholder]="config.placeholder"
    [collectionPath]="config.customLookupFld.path"
    [collectionFld]="config.customLookupFld.fld"
    [lookupItemDef]="config.customLookupItem"
    [isDisabled]="config.disabled"
    [formControlName]="config.name"
    [value]="config.value"
    [inputTransform]="config.inputValueTransform"
    (itemChosen)="valueChanged($event)"
  ></app-lookup>
</div>
`
})
export class FormLookupComponent implements Field {
  config: FieldConfig
  group: FormGroup
  onValueChg: Function
  form: FormGroup
  dialogRef: MatDialogRef<FormDialogComponent>

  valueChanged(rec) {
    this.config.customValueChg(this.config.name, rec)
    this.config.value = rec.id
  }

}
