import { Component, OnInit, OnDestroy } from '@angular/core';

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template';
import { Article, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig, defaultSelectionFields } from './article.model'
import { ArticleService } from './article.service';
import { CategoryService } from '../categories/category.service';
import { PropertyService } from '../properties/property.service';
import { DbService } from '../../../services/db.service';
import { PopupService } from '../../../services/popup.service';

import { BrwBaseClass } from '../../../shared/custom-components/baseclasses/browse';
import { EntityService } from '../../../shared/custom-components/baseclasses/entity-service.interface';

@Component({
  selector: 'app-articles-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class ArticlesBrwComponent extends BrwBaseClass<Article[]> implements OnInit, OnDestroy {

  constructor(
    private entityService: ArticleService,
    private dbService: DbService,
    private popupService: PopupService,
    private categorySrv: CategoryService,
    private propertySrv: PropertyService,
  ) {
    super(entityService, dbService, popupService);
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    this.selectionFields = defaultSelectionFields
    super.setLookupItems(this.categorySrv.initEntity$(), 'category', 'code', 'description')
    super.setLookupItems(this.propertySrv.initEntity$(), 'measurements', 'code', 'choices')
    super.setLookupItems(this.propertySrv.initEntity$(), 'colors', 'code', 'choices')
    super.ngOnInit() //volgorde van belang!
  }

}
