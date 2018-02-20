import { Component, OnInit, OnDestroy } from '@angular/core';

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template';
import { Category, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './category.model'
import { CategoryService } from './category.service';
import { PropertyService } from '../properties/property.service';
import { DbService } from '../../../services/db.service';
import { PopupService } from '../../../services/popup.service';
import { BrwBaseClass } from '../../../shared/custom-components/baseclasses/browse';
import { EntityService } from '../../../shared/custom-components/baseclasses/entity-service.interface';

@Component({
  selector: 'app-categories-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class CategoriesBrwComponent extends BrwBaseClass<Category[]> implements OnInit, OnDestroy {

  constructor(
    private entityService: CategoryService,
    private dbService: DbService,
    private popupService: PopupService,
    private propertySrv: PropertyService,
  ) {
    super(entityService, dbService, popupService);
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    super.setLookupItems(this.propertySrv.initEntity$(), 'measurements', 'code', 'choices')
    super.setLookupItems(this.propertySrv.initEntity$(), 'colors', 'code', 'choices')
    super.ngOnInit() //volgorde van belang!
  }

}
