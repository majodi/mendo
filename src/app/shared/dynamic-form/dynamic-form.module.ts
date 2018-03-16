import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatProgressSpinnerModule, MatRadioModule, MatChipsModule, MatExpansionModule, MatAutocompleteModule, MatSelectModule, MatOptionModule, MatSortModule, MatProgressBarModule, MatTableModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatCheckboxModule } from '@angular/material';

import { DynamicFieldDirective } from './components/dynamic-field.directive';
import { DynamicFormComponent } from './containers/dynamic-form/dynamic-form.component';
import { FormButtonComponent } from './components/form-button.component';
import { FormInputComponent } from './components/form-input.component';
import { FormSelectComponent } from './components/form-select.component';
import { FormChiplistComponent } from './components/form-chiplist.component';
import { FormPulldownComponent } from './components/form-pulldown.component';
import { FormLookupComponent } from './components/form-lookup.component';
import { FormDialogComponent } from './containers/form-dialog/form-dialog.component'
import { FormFilepickComponent } from './components/form-filepick.component';
import { FormImagedisplayComponent } from './components/form-imagedisplay.component';
import { FormStringdisplayComponent } from './components/form-stringdisplay.component';
import { FormCheckboxComponent } from './components/form-checkbox.component';
import { CustomComponentsModule } from '../custom-components/custom-components.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule, MatRadioModule, MatChipsModule, MatExpansionModule, MatAutocompleteModule, MatSelectModule, MatOptionModule, MatSortModule, MatProgressBarModule, MatTableModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatCheckboxModule,
    CustomComponentsModule,
  ],
  declarations: [
    DynamicFieldDirective,
    DynamicFormComponent,
    FormDialogComponent,
    FormButtonComponent,
    FormInputComponent,
    FormSelectComponent,
    FormChiplistComponent,
    FormPulldownComponent,
    FormLookupComponent,
    FormFilepickComponent,
    FormImagedisplayComponent,
    FormStringdisplayComponent,
    FormCheckboxComponent,
  ],
  exports: [
    DynamicFormComponent,
    CustomComponentsModule,
    FormDialogComponent,
  ],
  entryComponents: [
    FormButtonComponent,
    FormInputComponent,
    FormSelectComponent,
    FormChiplistComponent,
    FormPulldownComponent,
    FormLookupComponent,
    FormDialogComponent,
    FormFilepickComponent,
    FormImagedisplayComponent,
    FormStringdisplayComponent,
    FormCheckboxComponent,
  ]
})
export class DynamicFormModule {}
