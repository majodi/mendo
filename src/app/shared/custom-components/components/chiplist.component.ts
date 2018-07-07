import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-chiplist',
  template: `
<div>
  <mat-chip-list #tagList>
      <mat-chip *ngFor="let tag of tagListArr" [removable]="!isDisabled" (removed)="removeTag(tag)">
      {{tag}}<mat-icon matChipRemove>cancel</mat-icon>
      </mat-chip>
  </mat-chip-list><br>
  <mat-form-field>
    <mat-select [placeholder]="placeholder" name="tags" multiple [(ngModel)]="tagListArr" (selectionChange)="selectionChange($event)" [disabled]=isDisabled>
      <mat-select-trigger>Selecteer...</mat-select-trigger>
      <div style="text-align: right; padding: 5px">
        <button mat-mini-fab color="primary" (click)="selectNone()">geen</button>
        <button mat-mini-fab color="primary" (click)="selectAll()">alle</button>
        <button mat-mini-fab color="primary" (click)="swapSelected()">keer</button>
      </div>
      <mat-option *ngFor="let tagoption of tagOptionsArr" [value]="tagoption">{{tagoption}}</mat-option>
    </mat-select>
  </mat-form-field>
</div>
  `
})
export class ChiplistComponent implements OnInit, OnChanges {
  @Input() tagOptions: string | string[]
  @Input() tagList: any
  @Input() placeholder: string
  @Output() tagListChange = new EventEmitter()
  @Input() isDisabled = false
  tagOptionsArr = []
  tagListArr = []

  ngOnInit() {}

  ngOnChanges() {
    // console.log('ngChanges this.tagList: ', this.tagList)
    if (this.tagOptions !== undefined && this.tagList !== undefined) {
      if (typeof this.tagOptions === 'string') {
        this.tagOptionsArr = this.tagOptions ? this.tagOptions.split(',') : []
      } else {
        this.tagOptionsArr = this.tagOptions
      }
      this.tagListArr = []
      for (const key of Object.keys(this.tagList)) {
      // for (const key in this.tagList) {
        this.tagListArr.push(key)
      }
    }
  }

  selectionChange(event) {
    this.returnList()
  }

  selectNone() {
    this.tagListArr = []
  }

  selectAll() {
    this.tagListArr = this.tagOptionsArr
  }

  swapSelected() {
    this.tagListArr = this.tagOptionsArr.filter(e => !this.tagListArr.includes(e))
  }

  removeTag(tag: any): void {
    this.tagListArr.splice(this.tagListArr.indexOf(tag), 1)
    this.returnList()
  }

  returnList() {
    const tl = this.tagListArr.reduce((result, item) => {
        result[item] = true
        return result
    }, {})
    this.tagListChange.emit(tl)
  }

}
