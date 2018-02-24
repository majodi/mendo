import { Component, OnInit, OnDestroy, Injector, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template';
import { Category, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './category.model'
import { CategoryService } from './category.service';
import { PropertyService } from '../properties/property.service';
import { PropertiesBrwComponent } from '../properties/properties.brw';

import { BrwBaseClass } from '../../../shared/custom-components/baseclasses/browse';

@Component({
  selector: 'app-categories-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class CategoriesBrwComponent extends BrwBaseClass<Category[]> implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: CategoryService,
    private propertySrv: PropertyService,
  ) {
    super(dialogRef, entityService, injectorService);
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    // super.setLookupComponent(PropertiesBrwComponent, 'measurements', 'code', 'choices')
    super.setPulldownItems(this.propertySrv.initEntity$(), 'measurements', 'code', 'choices')
    super.setPulldownItems(this.propertySrv.initEntity$(), 'colors', 'code', 'choices')
    super.ngOnInit() //volgorde van belang!
  }

}