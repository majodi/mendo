import { Component, OnInit, OnDestroy } from '@angular/core';

import { Tile } from '../../../shared/custom-components/models/tile.model';
import { CategoryService } from '../categories/category.service';
import { Category } from '../categories/category.model';

@Component({
  selector: 'app-store',
  template: `
  <h1> Store Front </h1>
  <app-grid
    [title]="'Categorieën'"
    [titleIcon]="'more'"
    [data]="categoryData"
  ></app-grid>
  `,
  styles: [``]
})
export class StoreComponent implements OnInit, OnDestroy {
  categoryData: Tile[]

  constructor(
    private CategorySrv: CategoryService,
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
  }

  ngOnInit() {}

  ngOnDestroy() {}

}
