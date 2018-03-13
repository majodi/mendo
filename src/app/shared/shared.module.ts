import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule, MatRadioModule, MatChipsModule, MatExpansionModule, MatAutocompleteModule, MatSelectModule, MatOptionModule, MatSortModule, MatProgressBarModule, MatTableModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatCheckboxModule } from '@angular/material';

import { DynamicFormModule } from './dynamic-form/dynamic-form.module';
import { LoginComponent } from './authentication/login.component';

@NgModule({
  imports: [
      CommonModule,
      RouterModule,
      FormsModule, ReactiveFormsModule,
      FlexLayoutModule,
      MatProgressSpinnerModule, MatRadioModule, MatChipsModule, MatExpansionModule, MatAutocompleteModule, MatSelectModule, MatOptionModule, MatSortModule, MatProgressBarModule, MatTableModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatCheckboxModule,
      DynamicFormModule,
    ],
  declarations: [
    LoginComponent,
  ],
  entryComponents: [

  ],
  exports: [
    DynamicFormModule,
    LoginComponent,
  ],
})
export class SharedModule { }
