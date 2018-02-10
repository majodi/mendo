import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-chiplist',
  template: `
<div>
  <mat-chip-list #tagList>
      <mat-chip *ngFor="let tag of tagListArr" [removable]="!isDisabled" (remove)="removeTag(tag)">
      {{tag}}<mat-icon matChipRemove>cancel</mat-icon>
      </mat-chip>
  </mat-chip-list><br>
  <mat-form-field>
    <mat-select placeholder="Tags" name="tags" multiple [(ngModel)]="tagListArr" (selectionChange)="selectionChange($event)" [disabled]=isDisabled>
      <mat-select-trigger>Select tags...</mat-select-trigger>                  
      <mat-option *ngFor="let tagoption of tagOptionsArr" [value]="tagoption">{{tagoption}}</mat-option>
    </mat-select>
  </mat-form-field>
</div>
  `
})
export class ChiplistComponent implements OnInit, OnChanges {
  @Input() tagOptions: string | string[]
  @Input() tagList: any
  @Output() tagListChange = new EventEmitter();
  @Input() isDisabled = false;
  tagOptionsArr = []
  tagListArr = []

  ngOnInit() {}

  ngOnChanges() {
    if(this.tagOptions != undefined && this.tagList != undefined) {
      if(typeof this.tagOptions == 'string'){
        this.tagOptionsArr = this.tagOptions ? this.tagOptions.split(',') : []
      } else {
        this.tagOptionsArr = this.tagOptions
      }
      this.tagListArr = []
      for (var key in this.tagList) {
        this.tagListArr.push(key)
      }  
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

}
