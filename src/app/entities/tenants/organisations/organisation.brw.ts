import { Component, OnInit, OnDestroy } from '@angular/core';

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template';
import { Organisation, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './organisation.model'
import { OrganisationService } from './organisation.service';
import { DbService } from '../../../services/db.service';
import { PopupService } from '../../../services/popup.service';
import { GlobService } from '../../../services/glob.service';

import { BrwBaseClass } from '../../../shared/custom-components/baseclasses/browse';
// import { EntityService } from '../../../shared/custom-components/baseclasses/entity-service.interface';

@Component({
  selector: 'app-organisations-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class OrganisationsBrwComponent extends BrwBaseClass<Organisation[]> implements OnInit, OnDestroy {

  constructor(
    private entityService: OrganisationService,
    private dbService: DbService,
    private popupService: PopupService,
    private globService: GlobService,
  ) {
    super(entityService, dbService, popupService, globService);
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    super.ngOnInit() //volgorde van belang!
  }

}
