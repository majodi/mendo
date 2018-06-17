
import {of as observableOf,  Observable, Subject } from 'rxjs'

import {switchMap, debounceTime, startWith} from 'rxjs/operators'
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, OnChanges } from '@angular/core'
import { FormControl } from '@angular/forms'

import { LookupItem } from '../models/lookup-item.model'


import { MatAutocompleteTrigger } from '@angular/material'

@Component({
  selector: 'app-pulldown',
  template: `
  <mat-form-field style="width:100%">
    <input (blur)="onChoice()" (keyup.arrowdown)="openPanel()" matInput [matAutocomplete]="auto" [formControl]="lookupCtrl" placeholder="{{lookupPlaceholder}}" [disabled]=isDisabled>
    <mat-hint *ngIf="filteredLookupItems.length == 0" align="end" style="color:red">No match found</mat-hint>
    <mat-autocomplete #auto="matAutocomplete">
      <mat-option *ngFor="let item of filteredLookupItems" [value]="item.display" (onSelectionChange)="onChoice(item.display)">
        <span>{{ item.display }} (<small>{{item.subDisplay}}</small>)</span>
      </mat-option>
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
  lookupCtrl: FormControl
  filteredLookupItems: LookupItem[] = []

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
      this.itemChosen.emit(this.filteredLookupItems[0].id)
    } else {
      this.itemChosen.emit('')
    }
  }

  ngOnChanges() {
    this.lookupCtrl.setValue(this.displayLookup(this.lookupItems.find((item: LookupItem) => item.id === this.value)))
  }

  displayLookup(item?: LookupItem): string | undefined {
    return item ? item.display : undefined
  }

  openPanel() {
    if (!this.lookupCtrl.value) {
      this.filteredLookupItems = this.lookupItems
    }
  }

}
