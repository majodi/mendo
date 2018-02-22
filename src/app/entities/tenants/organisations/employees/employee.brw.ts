import { Component, OnInit, OnDestroy } from '@angular/core';

import { defaultTableTemplate } from '../../../../shared/custom-components/models/table-template';
import { Employee, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig, defaultSelectionFields } from './employee.model'
import { EmployeeService } from './employee.service';
import { OrganisationService } from '../organisation.service';
import { DbService } from '../../../../services/db.service';
import { PopupService } from '../../../../services/popup.service';
import { GlobService } from '../../../../services/glob.service';


import { BrwBaseClass } from '../../../../shared/custom-components/baseclasses/browse';
// import { EntityService } from '../../../../shared/custom-components/baseclasses/entity-service.interface';

@Component({
  selector: 'app-employees-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class EmployeesBrwComponent extends BrwBaseClass<Employee[]> implements OnInit, OnDestroy {

  constructor(
    private entityService: EmployeeService,
    private dbService: DbService,
    private popupService: PopupService,
    private globService: GlobService,
    private organisationSrv: OrganisationService,
  ) {
    super(entityService, dbService, popupService, globService);
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    this.selectionFields = defaultSelectionFields
    super.setLookupItems(this.organisationSrv.initEntity$(), 'organisation', 'address.name', 'address.city')
    super.ngOnInit() //volgorde van belang!
  }

}
