import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../models/field.interface';
import { FieldConfig } from '../models/field-config.interface';

@Component({
  selector: 'form-stringdisplay',
  template: `
  <div>
    <p class="mat-title">{{config.value}}</p>
    <br><br>
  </div>
  `
})
export class FormStringdisplayComponent implements Field {
  config: FieldConfig;
  group: FormGroup;
}
