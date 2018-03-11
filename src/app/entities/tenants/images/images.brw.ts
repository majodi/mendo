import { Component, OnInit, OnDestroy, Injector, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template';
import { Image, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig, defaultSelectionFields } from './image.model'
import { ImageService } from './image.service';

import { BrwBaseClass } from '../../../baseclasses/browse';

@Component({
  selector: 'app-images-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class ImagesBrwComponent extends BrwBaseClass<Image[]> implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: ImageService,
  ) {
    super(dialogRef, entityService, injectorService);
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    this.selectionFields = defaultSelectionFields
    super.ngOnInit() //volgorde van belang!
  }

}
