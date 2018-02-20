import { Component, OnInit, OnDestroy } from '@angular/core';

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template';
import { Property, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './property.model'
import { PropertyService } from './property.service';
import { ColumnDefenition } from '../../../shared/custom-components/models/column-defenition.model'
import { DbService } from '../../../services/db.service';
import { PopupService } from '../../../services/popup.service';
import { BrwBaseClass } from '../../../shared/custom-components/baseclasses/browse';
import { EntityService } from '../../../shared/custom-components/baseclasses/entity-service.interface';

@Component({
  selector: 'app-properties-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class PropertiesBrwComponent extends BrwBaseClass<Property[]> implements OnInit, OnDestroy {

  constructor(
    private entityService: PropertyService,
    private dbService: DbService,
    private popupService: PopupService,
  ) {
    super(entityService, dbService, popupService);
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    super.ngOnInit() //volgorde van belang!
  }

}
