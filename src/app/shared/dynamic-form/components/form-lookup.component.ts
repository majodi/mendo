import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../models/field.interface';
import { FieldConfig } from '../models/field-config.interface';

@Component({
  selector: 'form-lookup',
  template: `
<div [formGroup]="group">
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
    (itemChosen)="valueChanged($event)"
  ></app-lookup>
</div>
`
})
export class FormLookupComponent implements Field {
  config: FieldConfig;
  group: FormGroup;

  valueChanged(rec) {
    this.config.customValueChg(this.config.name, rec)
    this.config.value = rec.id
  }

}
