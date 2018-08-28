
import {of as observableOf,  Observable, Subject } from 'rxjs'

import {switchMap, debounceTime, startWith} from 'rxjs/operators'
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, OnChanges } from '@angular/core'
import { FormControl } from '@angular/forms'

import { LookupItem } from '../models/lookup-item.model'

import { MatAutocompleteTrigger, MatDialogRef, MatAutocomplete } from '@angular/material'
import { FormDialogComponent } from '../../dynamic-form/containers/form-dialog/form-dialog.component'

@Component({
  selector: 'app-pulldown',
  template: `
  <mat-form-field style="width:100%">
    <input #trigger (blur)="onChoice()" (keyup.arrowdown)="openPanel()" (keyup.escape)="closeDialog()" matInput [matAutocomplete]="auto" [formControl]="lookupCtrl" placeholder="{{lookupPlaceholder}}" [disabled]=isDisabled>
    <mat-hint *ngIf="filteredLookupItems.length == 0" align="end" style="color:red">geen match</mat-hint>
    <mat-hint *ngIf="exactMatch" align="end" style="color:green">gevonden!, druk tab</mat-hint>
    <mat-autocomplete #auto="matAutocomplete" (opened)="panelOpened()" (closed)="panelClosed()">
    <ng-container *ngIf="exactMatch === false">
      <mat-option *ngFor="let item of filteredLookupItems" [value]="item.display" (onSelectionChange)="onChoice(item.display)">
        <span>{{ item.display }} (<small>{{item.subDisplay}}</small>)</span>
      </mat-option>
    </ng-container>
    </mat-autocomplete>
  </mat-form-field>
  `
})
export class PulldownComponent implements OnChanges {
  private ngUnsubscribe = new Subject<string>()
  @Input() value: string
  @Input() lookupPlaceholder: string
  @Input() lookupItems: LookupItem[]
  @Output() itemChosen = new EventEmitter()
  @Input() isDisabled = false
  @Input() dialogRef: MatDialogRef<FormDialogComponent>
  lookupCtrl: FormControl
  filteredLookupItems: LookupItem[] = []
  exactMatch = false
  @ViewChild('trigger', { read: MatAutocompleteTrigger }) lookupPanel: MatAutocompleteTrigger
  @ViewChild('auto', { read: MatAutocomplete }) lookupPanelZelf: MatAutocomplete
  panelWasOpen = false

  constructor() {
    this.lookupCtrl = new FormControl()
    this.lookupCtrl.valueChanges.pipe(
    startWith(''),
    debounceTime(350),
    switchMap((input: string) => {
      if (this.lookupItems !== undefined) {
        this.filteredLookupItems = this.lookupItems.filter((item: LookupItem) => {
          const x = '' + input, inputLower = x.toLowerCase()
          const searchLower = (item.display + item.subDisplay + item.addSearch).toLowerCase()
          return (searchLower.indexOf(inputLower) !== -1)
        })
        console.log('this.filteredLookupItems: ', this.filteredLookupItems)
        this.exactMatch = this.filteredLookupItems.length === 1 ? true : false
      }
      return observableOf(input)
    }), ).subscribe()
  }

  onChoice(selection?) {
    if (selection) {
      const selected = this.lookupItems.find((item: LookupItem) => item.display === selection)
      this.itemChosen.emit(selected.id)
      return
    }
    if (this.filteredLookupItems.length === 1) {
      this.lookupCtrl.setValue(this.filteredLookupItems[0].display)
      this.itemChosen.emit(this.filteredLookupItems[0].id)
    } else {
      this.lookupCtrl.setValue('')
      this.itemChosen.emit('')
    }
  }

  panelOpened() {
    // console.log('panel opened')
    this.panelWasOpen = true
  }

  panelClosed() {
    // console.log('panel closed')
  }

  closeDialog() {
    // console.log('was open?: ', this.panelWasOpen)
    if (!this.panelWasOpen) {
      this.dialogRef.close()
    }
  }

  ngOnChanges() {
    this.lookupCtrl.setValue(this.displayLookup(this.lookupItems.find((item: LookupItem) => item.id === this.value)))
  }

  displayLookup(item?: LookupItem): string | undefined {
    return item ? item.display : undefined
  }

  openPanel() {
    this.panelWasOpen = true
    if (!this.lookupCtrl.value) {
      this.filteredLookupItems = this.lookupItems
    }
    this.exactMatch = false
  }

}
