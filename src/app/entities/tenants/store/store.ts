import { Component, OnInit, OnDestroy } from '@angular/core';

import { Tile } from '../../../shared/custom-components/models/tile.model';
import { CategoryService } from '../categories/category.service';
import { ArticleService } from '../articles/article.service';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { QueryItem } from '../../../models/query-item.interface';

@Component({
  selector: 'app-store',
  template: `
  <div style="width:100%">
  <app-grid
    [singleRow]="true"
    [title]="'Categorieën'"
    [data]="categoryData"
    (clicked)="onClickCategory($event)"
  ></app-grid>
  <hr>
  <app-grid
    [singleRow]="false"
    [title]="'Artikelen'"
    [buttonIcon]="'shopping_cart'"
    [buttonText]="'Bestel'"
    [data]="articleData"
  ></app-grid>
  </div>
  `,
  styles: [``]
})
export class StoreComponent implements OnInit, OnDestroy {
  categoryData: Tile[]
  articleData: Tile[]
  ngUnsubscribe = new Subject<string>()
  articleSelect = new BehaviorSubject<string|null>(null)

  constructor(
    private CategorySrv: CategoryService,
    private ArticleSrv: ArticleService,
  ) {
    this.CategorySrv.colDef = [{name: 'image_v'}]
    this.CategorySrv.formConfig = [{type: 'lookup', name: 'image', customLookupFld: {path: 'images', tbl: 'image', fld: 'name'}},]
    this.CategorySrv.initEntity$().takeUntil(this.ngUnsubscribe).subscribe(categories => {
      this.categoryData = categories.map(category => {
        return {
          id: category.id,
          title: category.description,
          image: category.image_v
        }  
      })
    })
    this.ArticleSrv.colDef = [{name: 'image_v'}]
    this.ArticleSrv.formConfig = [{type: 'lookup', name: 'image', customLookupFld: {path: 'images', tbl: 'image', fld: 'name'}},]
    this.articleSelect.switchMap(id => {
      if(id){
        return this.ArticleSrv.initEntity$([{fld: 'category', operator: '==', value: id}])
      } else {
        return this.ArticleSrv.initEntity$()
      }
    }).takeUntil(this.ngUnsubscribe)
    .subscribe(articles => {
      this.articleData = articles.map(article => {
        return {
          id: article.id,
          title: article.description_s,
          description: article.description_l,
          image: article.image_v,
          price: article.price
        }  
      })
    })
  }

  ngOnInit() {}

  onClickCategory(e) {
    this.articleSelect.next(e.id)
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()    
  }

}
