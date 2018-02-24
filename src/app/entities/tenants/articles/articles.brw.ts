import { Component, OnInit, OnDestroy, Injector } from '@angular/core';

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template';
import { Article, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig, defaultSelectionFields } from './article.model'
import { ArticleService } from './article.service';
import { CategoryService } from '../categories/category.service';
import { PropertyService } from '../properties/property.service';

import { BrwBaseClass } from '../../../shared/custom-components/baseclasses/browse';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-articles-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class ArticlesBrwComponent extends BrwBaseClass<Article[]> implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: ArticleService,
    private categorySrv: CategoryService,
    private propertySrv: PropertyService,
  ) {
    super(dialogRef, entityService, injectorService);
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    this.selectionFields = defaultSelectionFields
    super.setPulldownItems(this.categorySrv.initEntity$(), 'category', 'code', 'description')
    super.setPulldownItems(this.propertySrv.initEntity$(), 'measurements', 'code', 'choices')
    super.setPulldownItems(this.propertySrv.initEntity$(), 'colors', 'code', 'choices')
    super.ngOnInit() //volgorde van belang!
  }

}
