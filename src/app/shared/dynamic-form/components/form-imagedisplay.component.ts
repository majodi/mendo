import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../models/field.interface';
import { FieldConfig } from '../models/field-config.interface';

@Component({
  selector: 'form-imagedisplay',
  template: `
  <div>
    <img src="{{config.value}}" onerror="this.onerror=null;this.src='assets/image.svg'" width="64">
    <br><br>
  </div>
  `
})
export class FormImagedisplayComponent implements Field {
  config: FieldConfig;
  group: FormGroup;
}
