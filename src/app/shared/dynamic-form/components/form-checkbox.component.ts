import { Component, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../models/field.interface';
import { FieldConfig } from '../models/field-config.interface';

// <mat-checkbox name="fixedHeight" [(ngModel)]="cmsContainer.fixedHeight">Fixed Height</mat-checkbox>
// <br><br>

@Component({
  selector: 'form-checkbox',
  template: `
<div *ngIf="!config.doNotPopulate" [formGroup]="group">
  <mat-checkbox [formControlName]="config.name" (blur)="onBlur($event)">
    {{config.label}}
  </mat-checkbox>
</div>
<br><br>
  `
})
export class FormCheckboxComponent implements Field {
  config: FieldConfig;
  group: FormGroup;
  onValueChg: Function;

  onBlur(e) { //checkbox not included in customValueChg, so after blur
    this.config.value = e.target.value
    if(this.onValueChg != undefined) this.onValueChg();
  }
  
}
