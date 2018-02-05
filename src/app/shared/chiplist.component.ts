import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-chiplist',
  template: `
<div>
  <mat-chip-list #tagList>
      <mat-chip *ngFor="let tag of tagListArr" [removable]="true" (remove)="removeTag(tag)">
      {{tag}}<mat-icon matChipRemove>cancel</mat-icon>
      </mat-chip>
  </mat-chip-list><br>
  <mat-form-field>
    <mat-select placeholder="Tags" name="tags" multiple [(ngModel)]="tagListArr" (selectionChange)="selectionChange($event)">
      <mat-select-trigger>Select tags...</mat-select-trigger>                  
      <mat-option *ngFor="let tagoption of tagOptionsArr" [value]="tagoption">{{tagoption}}</mat-option>
    </mat-select>
  </mat-form-field>
</div>
  `
})
export class ChiplistComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<string>()
  @Input() tagOptions: string
  @Input() tagList: any
  @Output() tagListChange = new EventEmitter();
  tagOptionsArr = []
  tagListArr = []

  constructor() {}

  ngOnInit() {
    this.tagOptionsArr = this.tagOptions ? this.tagOptions.split(',') : []
    for (var key in this.tagList) {
      this.tagListArr.push(key)
    }
  }

  selectionChange(event) {
    this.returnList()
  }

  removeTag(tag:any):void {
    this.tagListArr.splice(this.tagListArr.indexOf(tag),1)
    this.returnList()
  }

  returnList() {
    let tl = this.tagListArr.reduce((result, item) => {
        result[item] = true
        return result
    }, {})
    this.tagListChange.emit(tl)
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }  

}
