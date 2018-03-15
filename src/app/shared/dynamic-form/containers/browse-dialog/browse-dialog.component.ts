// import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, Inject } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { Validators } from '@angular/forms';

// import { GlobService } from '../../../../services/glob.service';
// import { FieldConfig } from '../../models/field-config.interface';
// import { DynamicFormComponent } from '../../containers/dynamic-form/dynamic-form.component';

// @Component({
//   template: `
//   <h1> HELLO THERE </h1>
//   <br><br>
//   <button (click)="closeMe()">close me</button>
//   `
//   })
//   export class BrowseDialogComponent implements AfterViewInit {
//     @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

//     constructor(
//       public dialogRef: MatDialogRef<BrowseDialogComponent>,
//       @Inject(MAT_DIALOG_DATA) public data: any,
//       private gs: GlobService,
//       private cd: ChangeDetectorRef
//     ) {}

//     closeMe() {
//       this.dialogRef.close()
//     }

//     ngAfterViewInit() {
//     }

// }
