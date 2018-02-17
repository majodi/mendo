import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

import { LookupItem } from '../models/lookup-item.model';

import { Observable, Subject } from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/startWith';

@Component({
  selector: 'app-pulldown',
  template: `
  <mat-form-field style="width:100%">
    <input (blur)="onChoice()" matInput [matAutocomplete]="auto" [formControl]="lookupCtrl" placeholder="{{lookupPlaceholder}}" [disabled]=isDisabled>
    <mat-hint *ngIf="filteredLookupItems.length == 0" align="end" style="color:red">No match found</mat-hint>
    <mat-autocomplete #auto="matAutocomplete">
      <mat-option *ngFor="let item of filteredLookupItems" [value]="item.display" (onSelectionChange)="onChoice()">
        <span>{{ item.display }} (<small>{{item.subDisplay}}</small>)</span>
      </mat-option>
    </mat-autocomplete>
  </mat-form-field>
  `
})
export class PulldownComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<string>()
  @Input() value: string
  @Input() lookupPlaceholder: string
  @Input() lookupItems: LookupItem[]
  @Output() itemChosen = new EventEmitter();
  @Input() isDisabled = false;
  lookupCtrl: FormControl
  filteredLookupItems: LookupItem[] = []

  constructor() {
    this.lookupCtrl = new FormControl();
    this.lookupCtrl.valueChanges
    .startWith('')
    .debounceTime(350)
    .switchMap((input: string) => {
      if(this.lookupItems != undefined){
        this.filteredLookupItems = this.lookupItems.filter((item: LookupItem) => {
          let x = '' + input, inputLower = x.toLowerCase()
          let searchLower = (item.display + item.subDisplay + item.addSearch).toLowerCase()
          return (searchLower.indexOf(inputLower) != -1)
        })
      }
      return Observable.of(input)
    }).subscribe()
  }

  ngOnInit() {}

  onChoice() {
    console.log('choice: ', this.lookupCtrl.value)
    if(this.filteredLookupItems.length == 1){
      this.itemChosen.emit(this.filteredLookupItems[0].id)
    } else {
      this.itemChosen.emit('')      
    }
  }
    
  ngOnChanges() {
    console.log('changes from outside (value/lu items): ', this.value, this.lookupItems)
    this.lookupCtrl.setValue(this.displayLookup(this.lookupItems.find((item: LookupItem) => {return item.id == this.value})))
  }

  displayLookup(item?: LookupItem): string | undefined {
    console.log('displu: ',item)
    return item ? item.display : undefined
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }  

}
