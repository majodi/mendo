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
    <input name="lookup" matInput placeholder="{{lookupPlaceholder}}" [matAutocomplete]="auto" [formControl]="lookupCtrl" [disabled]=isDisabled>
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
  @Input() value: string
  @Input() lookupPlaceholder: string
  @Input() lookupItems$: Observable<LookupItem[]>
  @Output() itemChosen = new EventEmitter();
  @Input() isDisabled = false;
  lookupCtrl: FormControl
  filteredLookupItems$: Observable<LookupItem[]>

  constructor() {
    this.lookupCtrl = new FormControl();
    this.filteredLookupItems$ = this.lookupCtrl.valueChanges
    .startWith('')
    .debounceTime(350)
    .switchMap((input: string) => {
      console.log('--->>> input: ', input)
      let lui = this.lookupItems$
      .map(items => {
        console.log('items to filter: ', items)
        let fi = items.filter((item: LookupItem) => {
          let x = '' + input, inputLower = x.toLowerCase()
          let searchLower = (item.display + item.subDisplay + item.addSearch).toLowerCase()
          // console.log('searchlower/inputlower: ', searchLower, inputLower)
          return (searchLower.indexOf(inputLower) != -1)
        })
        console.log('filtered items: ', fi)
        return fi
      })
      // console.log('lui: ', lui)
      return lui
    })    
  }

  ngOnInit() {
//     this.lookupCtrl.valueChanges.takeUntil(this.ngUnsubscribe).debounceTime(350).subscribe(change => {
//       console.log('inputvalue changed: ', change, this.lookupCtrl.value)
//       if(this.lookupCtrl.value){
//         console.log('we have a value')
//         if(!this.lookupCtrl.value.id){
//           console.log('value NOT item')
// //          this.lookupCtrl.setErrors({noMatch: true})
// //          this.itemChosen.emit('invalid');
//         } else {
//           console.log('value IS item')
// //          this.itemChosen.emit(this.lookupCtrl.value['id']);
//     //       // this.itemChosen.emit(this.lookupCtrl.value);
//         }  
//       }  
//     })
      }

  ngOnChanges() {
    this.lookupItems$.subscribe(items => {                    //      take(1)
      console.log('ONCHG items/value: ', items, this.value)
      let found = items.find(item => item.id == this.value)
      console.log('found: ', found)
      this.lookupCtrl.setValue(items.find(item => item.id == this.value))
    })
    // this.lookupCtrl.setValue(this.value) //<<<<---- nu juiste display
  }

  displayLookup(item?: LookupItem): string | undefined {
    return item ? item.display : undefined
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }  

}
