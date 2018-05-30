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
      (keyup)="onKeyUp($event)"
      [formControl]="lookupInputCtrl"
      [placeholder]="lookupPlaceholder"
      [hidden]=isDisabled
    >
  </mat-form-field>
  <button
    type="button"
    style="margin:0px 20px"
    fxFlex="10"
    fxFlexAlign="center"
    mat-button
    [disabled]=isDisabled
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
  @Input() inputTransform: Function
  @Input() lookupPlaceholder: string
  @Input() isDisabled = false;
  @Input() collectionPath: string;
  @Input() collectionFld: string;
  @Input() lookupComponent: Type<any>
  @Input() lookupItemDef: LookupItem
  @Input() numeric: boolean
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
        this.db.getUniqueValueId(`${this.gs.entityBasePath}/${this.collectionPath}`, this.collectionFld, x, this.numeric ? true : undefined).subscribe(rec => {
          if(rec){
            const displayValueMain = this.objectValue(rec, this.lookupItemDef.display)
            const displayValueSub = this.objectValue(rec, this.lookupItemDef.subDisplay)
            if(this.lookupItemDef.subDisplayFunction == undefined){
              displayValue = displayValueMain + (displayValueSub != undefined ? ' - ' + displayValueSub : '')
              this.setControlValue(rec.id, displayValueMain, displayValueSub)  
            } else {
              const displayValueSubFormatted = this.lookupItemDef.subDisplayFunction(displayValueSub)
              displayValue = displayValueMain + (displayValueSub != undefined ? ' - ' +  displayValueSubFormatted : '')
              this.setControlValue(rec.id, displayValueMain, displayValueSubFormatted)
            }
            this.itemChosen.emit(rec)
          }
        })
      } else {
        displayValue = this.lastFoundFld + (this.lastFoundSub != undefined ? ' - ' + this.lastFoundSub : '')
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
          if(this.lookupItemDef.subDisplayFunction == undefined){
            this.setControlValue(this.value, this.objectValue(rec, this.lookupItemDef.display), this.objectValue(rec, this.lookupItemDef.subDisplay))
          } else {
            this.setControlValue(this.value, this.objectValue(rec, this.lookupItemDef.display), this.lookupItemDef.subDisplayFunction(this.objectValue(rec, this.lookupItemDef.subDisplay)))
          }
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
    if(this.inputTransform != undefined){
      this.lookupInputCtrl.setValue(this.inputTransform(e.target.value))
    }
  }

  lookupButtonClick() {
    this.ps.BrowseDialog(this.lookupComponent).then(rec => {
      if(rec){
        if(this.lookupItemDef.subDisplayFunction == undefined){
          this.setControlValue(rec['id'], this.objectValue(rec, this.lookupItemDef.display), this.objectValue(rec, this.lookupItemDef.subDisplay))
        } else {
          this.setControlValue(rec['id'], this.objectValue(rec, this.lookupItemDef.display), this.lookupItemDef.subDisplayFunction(this.objectValue(rec, this.lookupItemDef.subDisplay)))
        }
        this.itemChosen.emit(rec)
      }
    })
  }

  objectValue(o, key) {
    //also only two levels!!
    let keys = key.split('.')
    if(keys.length == 2) {
      return o[keys[0]][keys[1]]
    } else return o[key]
  }

}
