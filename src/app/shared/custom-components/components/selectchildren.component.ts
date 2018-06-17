import { Component, Input, Output, EventEmitter, OnChanges, Type } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Observable } from 'rxjs'
import { DbService } from '../../../services/db.service'
import { PopupService } from '../../../services/popup.service'

@Component({
  selector: 'app-selectchildren',
  template: `
<div>
  <mat-checkbox
    fxFlex="20"
    [disabled]=isDisabled
    [checked]="check"
    (change)="onCheckChange($event)">
    {{label}}
  </mat-checkbox>
</div>
<div fxLayout="row" fxLayoutAlign="start center" style="width:100%">
  <button
    type="button"
    style="margin:0px 20px"
    fxFlex="20"
    mat-button
    [disabled]=!selectButton
    (click)="buttonClick()">
    <mat-icon>playlist_add_check</mat-icon>
    Selectie
  </button>
  <p class="mat-subheading-1" [hidden]=!selectButton style="margin-bottom: initial">
    {{display}}
  <p>
</div>
  `
})
export class SelectChildrenComponent implements OnChanges {
  @Input() label: string
  @Input() checked: boolean
  @Input() isDisabled = false
  @Input() selectionComponent: Type<any>
  @Input() selectionParent: string
  @Input() formControlName: string
  @Output() checkChange = new EventEmitter()
  display = '(Selectie aanpassen)'
  selectButton = false
  check = false

  constructor(
    private db: DbService,
    private ps: PopupService
  ) {}

  ngOnChanges() {
    this.check = this.checked
    if (this.check && !this.isDisabled) {this.selectButton = true} else {this.selectButton = false}
  }

  onCheckChange(e) {
    this.checkChange.emit(e.checked)
  }

  buttonClick() {
    this.ps.BrowseDialog(this.selectionComponent, false, false, undefined, true, this.selectionParent, this.formControlName).then(v => {
      if (v === undefined) { v = 0 }
      this.display = v + ' items aangepast'
    })
    //    BrowseDialog(brwComponent: Type<any>, selectMode?: boolean, soberMode?: boolean, query?: QueryItem[], itemSelect?: boolean)
  }

}
