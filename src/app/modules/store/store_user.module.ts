import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { SharedModule } from '../../shared/shared.module';
import { StoreComponent } from '../../entities/tenants/store/store';
import { ArticleService } from '../../entities/tenants/articles/article.service';
import { CategoryService } from '../../entities/tenants/categories/category.service';
import { StoreUserRoutingModule } from './store_user.routing.module';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      StoreUserRoutingModule,
    ],
  declarations: [
      StoreComponent,
    ],
  exports: [
      StoreComponent,
    ],
  entryComponents: [],
  providers: [
      ArticleService,
      CategoryService,
    ]    
})
export class StoreUserModule { }
