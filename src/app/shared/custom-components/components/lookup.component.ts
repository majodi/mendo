import { Component, Input, Output, EventEmitter, OnChanges, Type } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DbService } from '../../../services/db.service'
import { GlobService } from '../../../services/glob.service';
import { PopupService } from '../../../services/popup.service';
import { LookupItem } from '../models/lookup-item.model';

@Component({
  selector: 'app-lookup',
  template: `
<div fxLayout="row" fxLayoutAlign="start start" style="width:100%">
  <mat-form-field fxFlex="30" fxFlexAlign="center">
    <input
      matInput
      type="text"
      [formControl]="lookupInputCtrl"
      (keyup)="onKeyUp($event)"
      [placeholder]="lookupPlaceholder"
      [disabled]=isDisabled
    >
  </mat-form-field>
  <button
    type="button"
    style="margin:0px 20px"
    fxFlex="10"
    fxFlexAlign="center"
    mat-button
    (click)="lookupButtonClick()">
    <mat-icon>search</mat-icon>
  </button>
  <p class="mat-subheading-1" fxFlexAlign="end">
    {{display}}
  <p>
</div>
  `
})
export class LookupComponent {
  @Input() value: string
  @Input() lookupPlaceholder: string
  @Input() isDisabled = false;
  @Input() collectionPath: string;
  @Input() collectionFld: string;
  @Input() lookupComponent: Type<any>
  @Input() lookupItemDef: LookupItem
  @Output() itemChosen = new EventEmitter(); //emit on selected in table or on unique
  lookupInputCtrl: FormControl
  display = ''
  lastFoundId: string
  lastFoundFld: string
  lastFoundSub: string

  constructor(
    private db: DbService,
    private gs: GlobService,
    private ps: PopupService
  ) {
    this.lookupInputCtrl = new FormControl();
    this.lookupInputCtrl.valueChanges
    .startWith('')
    .debounceTime(350)
    .switchMap((input: string) => {
      let x = '' + input, displayValue = ''
      if(this.lastFoundFld != x){
        this.db.getUniqueValueId(`${this.gs.entityBasePath}/${this.collectionPath}`, this.collectionFld, x).subscribe(rec => {
          if(rec){
            displayValue = rec[this.lookupItemDef.display] + ' - ' + rec[this.lookupItemDef.subDisplay]
            this.setControlValue(rec.id, rec[this.lookupItemDef.display], rec[this.lookupItemDef.subDisplay])
            this.itemChosen.emit(rec.id)  
          }
        })
      } else {
        displayValue = this.lastFoundFld + ' - ' + this.lastFoundSub
      }
      this.display = displayValue
      return Observable.of(input)
    }).subscribe()
  }

  ngOnChanges() {
    if(this.lastFoundId == this.value){
      this.lookupInputCtrl.setValue(this.lastFoundFld)
    } else {
      this.db.getUniqueValueId(`${this.gs.entityBasePath}/${this.collectionPath}`, 'id', this.value).subscribe(rec => {
        if(rec){
          this.setControlValue(this.value, rec[this.lookupItemDef.display], rec[this.lookupItemDef.subDisplay])
        }
      })
    }
  }

  setControlValue(id, value, subValue) {
    this.lookupInputCtrl.setValue(value)
    this.lastFoundId = id
    this.lastFoundFld = value
    this.lastFoundSub = subValue
  }

  onKeyUp(e) {
    // let val = e.target.value
  }

  lookupButtonClick() {
    this.ps.BrowseDialog(this.lookupComponent).then(rec => {
      if(rec){
        this.setControlValue(rec['id'], rec[this.lookupItemDef.display], rec[this.lookupItemDef.subDisplay])
        this.itemChosen.emit(rec.id)
      }
    })
  }

}