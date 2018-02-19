import { Component, OnInit, OnDestroy } from '@angular/core';

import { Article, defaultTitle, defaultTitleIcon, defaultTemplate, defaultColDef, defaultFormConfig } from './article.model'
import { ArticleService } from './article.service';
import { CategoryService } from '../categories/category.service';
import { PropertyService } from '../properties/property.service';
import { DbService } from '../../../services/db.service';

import { BrwBaseClass } from '../../../shared/custom-components/baseclasses/browse';
import { EntityService } from '../../../shared/custom-components/baseclasses/entity-service.interface';

@Component({
  selector: 'app-articles-brw',
  template: defaultTemplate,
  styles: [``]
})
export class ArticlesBrwComponent extends BrwBaseClass<Article[]> implements OnInit, OnDestroy {

  constructor(
    private entityService: ArticleService,
    private dbService: DbService,
    private categorySrv: CategoryService,
    private propertySrv: PropertyService,
  ) {
    super(entityService, dbService);
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    super.setLookupItems(this.categorySrv.initCategories$(), 'category', 'category', 'code', 'description')
    super.setLookupItems(this.propertySrv.initProperties$(), 'measurements', 'property', 'code', 'choices')
    super.setLookupItems(this.propertySrv.initProperties$(), 'colors', 'property', 'code', 'choices')
    super.ngOnInit() //volgorde van belang!
  }

}
