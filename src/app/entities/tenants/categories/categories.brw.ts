import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';

import { Category, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './category.model'
import { CategoryService } from './category.service';
import { PropertyService } from '../properties/property.service';
import { Property } from '../properties/property.model';
import { ColumnDefenition } from '../../../shared/custom-components/models/column-defenition.model'
import { FieldConfig } from '../../../shared/dynamic-form/models/field-config.interface';
import { DbService } from '../../../services/db.service';

@Component({
  selector: 'app-categories-brw',
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
export class CategoriesBrwComponent implements OnInit, OnDestroy {
  data: Category[]
  private ngUnsubscribe = new Subject<string>()
  entityPath: string
  title = defaultTitle
  titleIcon = defaultTitleIcon
  isLoading = true
  colDef: ColumnDefenition[]
  formConfig: FieldConfig[]

  constructor(
    private entitySrv: CategoryService,
    private propertySrv: PropertyService,
    private db: DbService
  ) {}

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig
    this.entityPath = this.entitySrv.entityPath
    this.entitySrv.initCategories$().takeUntil(this.ngUnsubscribe).subscribe(data => {
      this.data = data
      this.isLoading = false
    })
    this.propertySrv.initProperties$().takeUntil(this.ngUnsubscribe).subscribe((properties: Property[]) => {
      let propertiesMapping = properties.map((property: Property) => {
        return {id: property.id, display: property.code, subDisplay: property.choices, addSearch: ''}
      })
      this.formConfig.find(c => {return c.name === 'measurements'})['customLookupItems'] = propertiesMapping
      this.formConfig.find(c => {return c.name === 'colors'})['customLookupItems'] = propertiesMapping
    })
  }

  clicked(brwClick: {fld: string, rec: {}}) {
    let rec = brwClick.fld == 'insert' ? {} : brwClick.rec
    if(brwClick.fld == 'insert'){
      this.formConfig.map(fld => fld.value = '')
      this.db.insertDialog(this.formConfig, rec, this.entityPath).then(id => {}).catch(err => console.log(err))
    } else {
      this.db.changeDeleteDialog(this.formConfig, rec, this.entityPath).catch(err => console.log(err))
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }  

}
