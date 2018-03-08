import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Validators } from '@angular/forms';

import { GlobService } from '../../../../services/glob.service';
import { FieldConfig } from '../../models/field-config.interface';
import { DynamicFormComponent } from '../../containers/dynamic-form/dynamic-form.component';

@Component({
  template: `
    <mat-dialog-content>
      <h1 fxFlex class="mat-display-1">{{gs.actionMessage[data.action]}}</h1>
      <dynamic-form
        [config]="data.fieldConfig"
        [formAction]="data.action"
        [onValueChg]="data.onValueChg"
        #form="dynamicForm"
        (submit)="submit($event)">
      </dynamic-form>
      <br>
    </mat-dialog-content>
  `
  })
  export class FormDialogComponent implements AfterViewInit {
    @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

    constructor(
      public dialogRef: MatDialogRef<FormDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private gs: GlobService,
      private cd: ChangeDetectorRef
    ) {}

    ngAfterViewInit() {
      let previousValid = this.form.valid;
      this.form.changes.subscribe(() => {
        // console.log('hier doen?: ', this.form.value, this.form.config)
        // if(this.data.onValueChg != undefined){this.data.onValueChg()}
        if (this.form.valid !== previousValid) {
          previousValid = this.form.valid;
          this.form.setDisabled('submit', !previousValid);
        }
      });
      this.setFormValues()
      this.form.setDisabled('submit', true);
      this.cd.detectChanges(); // nodig anders foutmelding
    }

    setFormValues() { // flatten to match control names, only 2 levels!! Not for chiplist!!
      let obj = this.data.formRecord
      let config: FieldConfig[] = this.data.fieldConfig
      this.form.form.reset()
      Object.keys(obj).map(l1 => {
        if(l1){
          let fieldDef = config.find(c => c.name == l1)
          if(typeof obj[l1] == 'object' && obj[l1] != null && (fieldDef && fieldDef['type'] != 'chiplist')) {
            Object.keys(obj[l1]).map(l2 => this.form.setValue(l1+'.'+l2, obj[l1][l2]))
          } else {this.form.setValue(l1, obj[l1])}  
        }
      })      
    }
  
    submit(e) {
      this.dialogRef.close(e)
    }

}
  