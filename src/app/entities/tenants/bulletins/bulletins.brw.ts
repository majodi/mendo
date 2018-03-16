import { Component, OnInit, OnDestroy, Injector, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template';
import { Bulletin, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './bulletin.model'
import { BulletinService } from './bulletin.service';
import { ImagesBrwComponent } from '../images/images.brw';

import { BrwBaseClass } from '../../../baseclasses/browse';
import { Embed } from '../../../shared/dynamic-form/models/embed.interface';

@Component({
  selector: 'app-bulletins-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class BulletinsBrwComponent extends BrwBaseClass<Bulletin[]> implements OnInit, OnDestroy {
  embeds: Embed[] = [
    {type: 'beforeSave', code: (action, o) => {
      if(action == 1){
        const today = new Date()
        o['date'] = today
        if(!o['sticky']){
          this.db.updateWithQuery({date: today}, this.entityService.entityPath, [{fld: 'sticky', operator: '==', value: true}])
        }
        return Promise.resolve()
      } else return Promise.resolve()
    }}
  ]

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: BulletinService,
  ) {
    super(dialogRef, entityService, injectorService);
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    super.setLookupComponent(ImagesBrwComponent, 'image', 'code', 'description')
    super.ngOnInit() //volgorde van belang!
  }

}
