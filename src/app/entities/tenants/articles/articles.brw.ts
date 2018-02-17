import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject, Observable } from 'rxjs';

import { Article, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './article.model'
import { ArticleService } from './article.service';
import { CategoryService } from '../categories/category.service';
import { Category } from '../categories/category.model';
import { LookupItem } from '../../../shared/custom-components/models/lookup-item.model';
import { ColumnDefenition } from '../../../shared/custom-components/models/column-defenition.model'
import { FieldConfig } from '../../../shared/dynamic-form/models/field-config.interface';
import { DbService } from '../../../services/db.service';

@Component({
  selector: 'app-articles-brw',
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
export class ArticlesBrwComponent implements OnInit, OnDestroy {
  data: Article[]
  private ngUnsubscribe = new Subject<string>()
  entityPath: string
  title = defaultTitle
  titleIcon = defaultTitleIcon
  isLoading = true
  colDef: ColumnDefenition[]
  formConfig: FieldConfig[]

  constructor(
    private entitySrv: ArticleService,
    private categorySrv: CategoryService,
    private db: DbService
  ) {}

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig
    this.entityPath = this.entitySrv.entityPath
    this.entitySrv.initArticles$().takeUntil(this.ngUnsubscribe).subscribe(data => {
      this.data = data
      this.isLoading = false
    })
    this.categorySrv.initCategories$().takeUntil(this.ngUnsubscribe).subscribe((categories: Category[]) => {
      this.formConfig.find(c => {return c.name === 'category'})['customLookupItems'] = categories
      .map((category: Category) => {
        return {id: category.id, display: category.code, subDisplay: category.description, addSearch: ''}
      })
    })
  }

  clicked(brwClick: {fld: string, rec: {}}) {
    if(brwClick.fld == 'insert'){
      this.db.insertDialog(this.formConfig, brwClick, this.entityPath).then(id => {}).catch(err => console.log(err))
    } else {
      console.log('rec voor chg', brwClick.rec)
      this.db.changeDeleteDialog(this.formConfig, brwClick.rec, this.entityPath).catch(err => console.log(err))
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }  

}
