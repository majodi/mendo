import { Component, ViewContainerRef, ViewChild } from '@angular/core'
import { FormGroup } from '@angular/forms'

import { Field } from '../models/field.interface'
import { FieldConfig } from '../models/field-config.interface'
import { MatAutocompleteTrigger, MatDialogRef } from '@angular/material'
import { FormDialogComponent } from '../containers/form-dialog/form-dialog.component'

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'form-input',
  template: `
  <mat-form-field *ngIf="!config.doNotPopulate" style="width:100%" [formGroup]="group">
  <ng-container *ngIf="!config.inputLines; then input_tpl else textarea_tpl"></ng-container>
  <ng-template #input_tpl>
    <input
      #trigger
      matInput
      [matAutocomplete]="auto"
      [type]="getOverruleType()"
      (keyup)="onKeyUp($event)"
      (blur)="onBlur($event)"
      [placeholder]="config.placeholder"
      [formControlName]="config.name"
      [readonly]="config.readOnly">
  </ng-template>
  <ng-template #textarea_tpl>
    <textarea
      matInput
      type="text"
      [rows]="config.inputLines"
      (keyup)="onKeyUp($event)"
      (blur)="onBlur($event)"
      [placeholder]="config.placeholder"
      [formControlName]="config.name"
      [readonly]="config.readOnly"></textarea>
  </ng-template>
  </mat-form-field>
  <mat-autocomplete #auto="matAutocomplete">
    <ng-container *ngIf="suggestions.length > 1">
      <mat-option *ngFor="let suggestion of suggestions" [value]="suggestion['suggestion']" (onSelectionChange)="onChoice(suggestion)">
        {{ suggestion['suggestion'] }}
      </mat-option>
    </ng-container>
  </mat-autocomplete>
  `
})
export class FormInputComponent implements Field {
  config: FieldConfig
  group: FormGroup
  onValueChg: Function
  form: FormGroup
  dialogRef: MatDialogRef<FormDialogComponent>

  @ViewChild('trigger', { read: MatAutocompleteTrigger }) lookupPanel: MatAutocompleteTrigger
  suggestions = []
  suggestionsPending = false
  lastSuggestionRequest = ''
  currentEntryValue = ''
  lastCheckedEntryValue = ''

  onKeyUp(e?) {
    if (e !== undefined && e.key === 'Escape') {this.dialogRef.close()}
    this.currentEntryValue = e !== undefined ? e.target.value : this.currentEntryValue
    if (e === undefined || this.currentEntryValue !== this.lastCheckedEntryValue) {
      this.lastCheckedEntryValue = this.currentEntryValue
      if (this.config.suggestions !== undefined && !this.suggestionsPending && this.currentEntryValue.length > 0) {
        this.suggestionsPending = true
        this.lastSuggestionRequest = this.currentEntryValue
        this.requestSuggestions(this.currentEntryValue)
        setTimeout(() => {
          this.suggestionsPending = false
          if (this.currentEntryValue !== this.lastSuggestionRequest) {this.onKeyUp()}
        }, 600)
      }
      if (this.config.inputValueTransform !== undefined) {
        e.target.value = this.config.inputValueTransform(this.currentEntryValue)
        this.config.value = e.target.value
      }
    }
  }

  requestSuggestions(value) {
    this.config.suggestions(value).subscribe(suggestions => {
      this.suggestions = suggestions
    })
  }

  onChoice(picked) {
    this.lastCheckedEntryValue = picked
    if (
      picked['toUpdateField'] !== undefined &&
      this.form.controls[picked['toUpdateField']] !== undefined &&
      picked['toUpdateValue'] !== undefined &&
      !this.form.controls[picked['toUpdateField']].value
    ) {
      this.form.controls[picked['toUpdateField']].setValue(picked['toUpdateValue'], {emitEvent: true})
    }
  }

  getOverruleType() {
    if (this.config.inputType !== undefined) {
      if (['number', 'password', 'date', 'email'].includes(this.config.inputType)) {
        return this.config.inputType
      }
    }
  }

  onBlur(e) { // input not included in customValueChg, so after blur
    if (this.lookupPanel !== undefined && !this.lookupPanel.panelOpen) {
      this.config.value = e.target.value
      if (this.onValueChg !== undefined) { this.onValueChg(this.config.name, this.config.value) }
    }
  }

}
