import { Component, OnInit, OnDestroy, Injector } from '@angular/core';

import { defaultTableTemplate } from '../../../../shared/custom-components/models/table-template';
import { FormResult, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './formresult.model'
import { FormResultService } from './formresult.service';
import { FormFieldService } from '../formfields/formfield.service';

import { BrwBaseClass } from '../../../../baseclasses/browse';
import { MatDialogRef } from '@angular/material';
import { Embed } from '../../../../shared/dynamic-form/models/embed.interface';

@Component({
  selector: 'app-formresults-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class FormResultsBrwComponent extends BrwBaseClass<FormResult[]> implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: FormResultService,
    private formFieldSrv: FormFieldService,
  ) {
    super(dialogRef, entityService, injectorService);
  }

  ngOnInit() {
    this.formFieldSrv.initEntity$([{fld: 'form', operator: '==', value: 'FSCfXVo8aJfowhuC8xH6'}]).subscribe(fld => {
      console.log('frm fld: ', fld)
    })
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    super.ngOnInit() //volgorde van belang!
  }

}
