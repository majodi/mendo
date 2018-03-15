import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../models/field.interface';
import { FieldConfig } from '../models/field-config.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'form-stringdisplay',
  template: `
  <div *ngIf="!config.hidden">
    <p class="mat-title">{{config.label}}: {{config.value}}</p>
    <br><br>
  </div>
  `
})
export class FormStringdisplayComponent implements Field {
  config: FieldConfig;
  group: FormGroup;
  onValueChg: Function;
}
