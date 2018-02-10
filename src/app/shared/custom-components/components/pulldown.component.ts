import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

import { LookupItem } from '../models/lookup-item.model';

import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-pulldown',
  template: `
  <mat-form-field style="width:100%">
    <input name="lookup" matInput placeholder="{{lookupPlaceholder}}" [matAutocomplete]="auto" [formControl]="lookupCtrl" required>
    <mat-hint *ngIf="lookupCtrl.value && !lookupCtrl.value?.id" align="end" style="color:red">No match found</mat-hint>
    <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayLookup">
      <mat-option *ngFor="let item of filteredLookupItems$ | async" [value]="item">
        <span>{{ item.display }} (<small>{{item.subDisplay}}</small>)</span>
      </mat-option>
    </mat-autocomplete>
  </mat-form-field>
  `
})
export class PulldownComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<string>()
  @Input() lookupPlaceholder: string
  @Input() lookupItems$: Observable<LookupItem[]>
  @Output() itemChosen = new EventEmitter();
  lookupCtrl: FormControl
  filteredLookupItems$: Observable<LookupItem[]>

  constructor() {
    this.lookupCtrl = new FormControl();
    this.filteredLookupItems$ = this.lookupCtrl.valueChanges
    .startWith('')
    .debounceTime(350)
    .switchMap((input: string) => {
      return this.lookupItems$.map(items => {             //limit nr of records for pulldown
        return items.filter((item: LookupItem) => {
          let x = '' + input, inputLower = x.toLowerCase()
          let searchLower = (item.display + item.subDisplay + item.addSearch).toLowerCase()
          return (searchLower.indexOf(inputLower) != -1)
        })
      })
    })    
  }

  ngOnInit() {
    this.lookupCtrl.valueChanges.takeUntil(this.ngUnsubscribe).debounceTime(350).subscribe(change => {
      if(this.lookupCtrl.value){
        if(!this.lookupCtrl.value.id){
          this.lookupCtrl.setErrors({noMatch: true})
          this.itemChosen.emit('invalid');
        } else {
          this.itemChosen.emit(this.lookupCtrl.value);
        }  
      }
    })
  }

  displayLookup(item?: LookupItem): string | undefined {
    return item ? item.subDisplay : undefined
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }  

}
