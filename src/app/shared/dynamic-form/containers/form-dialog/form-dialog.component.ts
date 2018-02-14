import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Validators } from '@angular/forms';

import { FieldConfig } from '../../models/field-config.interface';
import { DynamicFormComponent } from '../../containers/dynamic-form/dynamic-form.component';

@Component({
  template: `
    <mat-dialog-content>
      <h1 fxFlex class="mat-display-1">Action {{data.action}}</h1>
      <dynamic-form
        [config]="data.fieldConfig"
        [formAction]="data.action"
        #form="dynamicForm"
        (submit)="submit($event)">
      </dynamic-form>
    </mat-dialog-content>
  `
  })
  export class FormDialogComponent implements AfterViewInit {
    @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

    constructor(
      public dialogRef: MatDialogRef<FormDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private cd: ChangeDetectorRef
    ) {}

    ngAfterViewInit() {
      let previousValid = this.form.valid;
      this.form.changes.subscribe(() => {
        if (this.form.valid !== previousValid) {
          previousValid = this.form.valid;
          this.form.setDisabled('submit', !previousValid);
        }
      });
      this.setFormValues()
      this.form.setDisabled('submit', true);
      this.cd.detectChanges(); // nodig anders foutmelding
    }

    setFormValues() { // flatten to match control names, only 2 levels!!
      let obj = this.data.formRecord
      Object.keys(obj).map(l1 => {
        if(typeof obj[l1] == 'object') {
          Object.keys(obj[l1]).map(l2 => this.form.setValue(l1+'.'+l2, obj[l1][l2]))
        } else {this.form.setValue(l1, obj[l1])}
      })      
      // Object.keys(this.data.formRecord).map(formfield =>
      //   this.form.setValue(formfield, this.data.formRecord[formfield])
      // )
    }
  
    submit(e) {
      console.log('e: ', e)
      this.dialogRef.close(e)
    }

}
  