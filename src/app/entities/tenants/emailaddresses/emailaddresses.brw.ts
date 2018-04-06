import { Component, OnInit, OnDestroy, Injector } from '@angular/core';

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template';
import { EmailAddress, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './emailaddress.model'
import { EmailAddressService } from './emailaddress.service';

import { BrwBaseClass } from '../../../baseclasses/browse';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-emailaddresses-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class EmailAddressesBrwComponent extends BrwBaseClass<EmailAddress[]> implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: EmailAddressService,
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
