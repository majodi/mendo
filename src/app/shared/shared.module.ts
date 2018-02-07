import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule, MatRadioModule, MatChipsModule, MatExpansionModule, MatAutocompleteModule, MatSelectModule, MatOptionModule, MatSortModule, MatProgressBarModule, MatTableModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatCheckboxModule } from '@angular/material';

import { ChiplistComponent } from './chiplist.component';
// todo import {  } from './choice.component';
import { PopupDialog } from './popupdialog.component';
import { PulldownComponent } from './pulldown.component';
import { TableComponent } from './table.component';

@NgModule({
  imports: [
      CommonModule,
      FormsModule, ReactiveFormsModule,
      FlexLayoutModule,
      MatProgressSpinnerModule, MatRadioModule, MatChipsModule, MatExpansionModule, MatAutocompleteModule, MatSelectModule, MatOptionModule, MatSortModule, MatProgressBarModule, MatTableModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatCheckboxModule,
    ],
  declarations: [PulldownComponent, ChiplistComponent, PopupDialog, TableComponent],
  exports: [PulldownComponent, ChiplistComponent, PopupDialog, TableComponent],
})
export class SharedModule { }
