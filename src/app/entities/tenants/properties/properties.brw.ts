import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';

import { Property, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './property.model'
import { PropertyService } from './property.service';
import { ColumnDefenition } from '../../../shared/custom-components/models/column-defenition.model'
import { FieldConfig } from '../../../shared/dynamic-form/models/field-config.interface';
import { DbService } from '../../../services/db.service';

@Component({
  selector: 'app-properties-brw',
  template: `
  <app-table
    [title]="title"
    [titleIcon]="titleIcon"
    [isLoading]="isLoading"
    [data]="data"
    [columnDefs]="colDef"
    (clicked)="clicked($event)"
  ></app-table>  
  `,
  styles: [``]
})
export class PropertiesBrwComponent implements OnInit, OnDestroy {
  data: Property[]
  private ngUnsubscribe = new Subject<string>()
  entityPath: string
  title = defaultTitle
  titleIcon = defaultTitleIcon
  isLoading = true
  colDef: ColumnDefenition[]
  formConfig: FieldConfig[]

  constructor(
    private entitySrv: PropertyService,
    private db: DbService
  ) {}

  ngOnInit() {
    this.entitySrv.initProperties$().takeUntil(this.ngUnsubscribe).subscribe(data => {
      this.data = data
      this.isLoading = false
    })
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig
    this.entityPath = this.entitySrv.entityPath
  }

  clicked(brwClick: {fld: string, rec: {}}) {
    if(brwClick.fld == 'insert'){
      this.db.insertDialog(this.formConfig, brwClick, this.entityPath).then(id => {}).catch(err => console.log(err))
    } else {
      this.db.changeDeleteDialog(this.formConfig, brwClick.rec, this.entityPath).catch(err => console.log(err))
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }  

}
