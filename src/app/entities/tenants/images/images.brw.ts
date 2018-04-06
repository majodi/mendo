import { Component, OnInit, OnDestroy, Injector, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template';
import { Image, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig, defaultSelectionFields } from './image.model'
import { ImageService } from './image.service';

import { BrwBaseClass } from '../../../baseclasses/browse';
import { Embed } from '../../../shared/dynamic-form/models/embed.interface';

@Component({
  selector: 'app-images-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class ImagesBrwComponent extends BrwBaseClass<Image[]> implements OnInit, OnDestroy {
  embeds: Embed[] = [
    {type: 'beforeSave', code: (action, image) => {
      if(action == 1){
        image['thumbName'] = image['name']
      }
      return Promise.resolve()
    }}
  ]

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: ImageService,
  ) {
    super(dialogRef, entityService, injectorService);
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig.map(x => Object.assign({}, x));
    // this.formConfig = defaultFormConfig
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    this.selectionFields = defaultSelectionFields
    super.ngOnInit() //volgorde van belang!
  }

}
