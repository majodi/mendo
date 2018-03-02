import { Component, OnInit, OnDestroy } from '@angular/core';

import { Tile } from '../../../shared/custom-components/models/tile.model';
import { CategoryService } from '../categories/category.service';
import { ArticleService } from '../articles/article.service';
// import { Category } from '../categories/category.model';

@Component({
  selector: 'app-store',
  template: `
  <div style="width:100%">
  <app-grid
    [singleRow]="true"
    [title]="'Categorieën'"
    [data]="categoryData"
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
/////////////////////////////////////TODO unsubscribe!!!!!!
  constructor(
    private CategorySrv: CategoryService,
    private ArticleSrv: ArticleService,
  ) {
    this.CategorySrv.formConfig = [{type: 'lookup', name: 'image', customLookupFld: {path: 'images', tbl: 'image', fld: 'name'}},]
    this.CategorySrv.initEntity$().subscribe(categories => {
      this.categoryData = categories.map(category => {
        return {
          title: category.description,
          image: category.image_v
        }  
      })
    })
    this.ArticleSrv.formConfig = [{type: 'lookup', name: 'image', customLookupFld: {path: 'images', tbl: 'image', fld: 'name'}},]
    this.ArticleSrv.initEntity$().subscribe(articles => {
      this.articleData = articles.map(article => {
        return {
          title: article.description_s,
          description: article.description_l,
          image: article.image_v
        }  
      })
    })
  }

  ngOnInit() {}

  ngOnDestroy() {}

}
