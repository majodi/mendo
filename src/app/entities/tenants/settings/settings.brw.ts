import { Component, OnInit, OnDestroy, Injector } from '@angular/core';

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template';
import { Setting, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './setting.model'
import { SettingService } from './setting.service';

import { BrwBaseClass } from '../../../baseclasses/browse';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-settings-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class SettingsBrwComponent extends BrwBaseClass<Setting[]> implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: SettingService,
  ) {
    super(dialogRef, entityService, injectorService);
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig.map(x => Object.assign({}, x));
    // this.formConfig = defaultFormConfig
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    super.ngOnInit() //volgorde van belang!
  }

}
