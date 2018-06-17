import { Component } from '@angular/core'
import { FormGroup } from '@angular/forms'

import { Field } from '../models/field.interface'
import { FieldConfig } from '../models/field-config.interface'

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'form-imagedisplay',
  template: `
  <div *ngIf="!config.doNotPopulate">
    <img src="{{config.value}}" onerror="this.onerror=null;this.src='assets/image.svg'" [ngStyle]="config.imageStyle">
  <br><br>
  </div>
  `
})
export class FormImagedisplayComponent implements Field {
  config: FieldConfig
  group: FormGroup
  onValueChg: Function
}
