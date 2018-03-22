import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template';
import { Form, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './form.model'
import { FormService } from './form.service';

import { BrwBaseClass } from '../../../baseclasses/browse';
import { MatDialogRef } from '@angular/material';
import { Embed } from '../../../shared/dynamic-form/models/embed.interface';

@Component({
  selector: 'app-forms-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class FormsBrwComponent extends BrwBaseClass<Form[]> implements OnInit, OnDestroy {
  embeds: Embed[] = [
    {type: 'beforeChgDialog', code: (rec, fld) => {
      // console.log('beforeChgDialog embed', rec, fld)
      if(fld == 'edit'){
        this.gs.navigateWithQuery('/app-tenant/formfields', 'form', '==', rec['id'])
        return true
      }
      if(fld == 'results'){
        this.gs.navigateWithQuery('/app-tenant/formresults', 'form', '==', rec['id'])
        return true
      }
      // return Promise.resolve('nothing...')
      return false
    }}
  ]

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: FormService,
    private router: Router,
  ) {
    super(dialogRef, entityService, injectorService);
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    super.ngOnInit() //volgorde van belang!
  }

}
