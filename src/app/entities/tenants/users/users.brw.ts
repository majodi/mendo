import { Component, OnInit, OnDestroy, Injector } from '@angular/core';

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template';
import { defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './user.model'
import { User } from '../../../models/user.model';
import { UserService } from './user.service';

import { BrwBaseClass } from '../../../baseclasses/browse';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-users-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class UsersBrwComponent extends BrwBaseClass<User[]> implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: UserService,
  ) {
    super(dialogRef, entityService, injectorService);
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig.map(x => Object.assign({}, x));
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    this.insertButton = false
    this.select = true
    super.ngOnInit() //volgorde van belang!
  }

}
