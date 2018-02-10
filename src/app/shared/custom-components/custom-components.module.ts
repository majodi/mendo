import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatProgressSpinnerModule, MatRadioModule, MatChipsModule, MatExpansionModule, MatAutocompleteModule, MatSelectModule, MatOptionModule, MatSortModule, MatProgressBarModule, MatTableModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatCheckboxModule } from '@angular/material';

import { ChiplistComponent } from './components/chiplist.component';
import { PopupDialog } from './components/popupdialog.component';
import { PulldownComponent } from './components/pulldown.component';
import { TableComponent } from './components/table.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    FlexLayoutModule,
    MatProgressSpinnerModule, MatRadioModule, MatChipsModule, MatExpansionModule, MatAutocompleteModule, MatSelectModule, MatOptionModule, MatSortModule, MatProgressBarModule, MatTableModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatCheckboxModule,
  ],
  declarations: [
    ChiplistComponent,
    PopupDialog,
    PulldownComponent,
    TableComponent
  ],
  exports: [
    ChiplistComponent,
    PopupDialog,
    PulldownComponent,
    TableComponent
  ],
  entryComponents: [
  ]
})
export class CustomComponentsModule {}
