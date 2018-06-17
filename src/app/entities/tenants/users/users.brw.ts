import { Component, OnInit, OnDestroy, Injector } from '@angular/core'

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template'
import { defaultTitle, defaultTitleIcon, defaultColDef } from './user.model'
import { User } from '../../../models/user.model'
import { UserService } from './user.service'

import { BrwBaseClass } from '../../../baseclasses/browse'
import { MatDialogRef } from '@angular/material'
import { Embed } from '../../../shared/dynamic-form/models/embed.interface'

@Component({
  selector: 'app-users-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class UsersBrwComponent extends BrwBaseClass<User[]> implements OnInit, OnDestroy {
  embeds: Embed[] = [
    {type: 'beforeChgDialog', code: (rec, fld) => {
      if (rec.employee !== undefined && rec.level === 0 && this.gs.activeUser.level > 25) {
        this.ps.buttonDialog(`${this.gs.activeUser.level === 100 ? 'Employee: ' + rec['employee'] + ' - User: ' + rec['id'] + '\r\n\r\n' : ''}Gebruiker promoveren naar Organisatiebeheerder?`, 'Annuleer', 'Promoveer').then(b => {
          if (b === 2) {
            this.db.setDoc({level: 25}, `users/${rec['uid']}`, {merge: true})
          }
        })
      }
      if (rec.level >= 25 && this.gs.activeUser.level > 25) {
        this.ps.buttonDialog(`${this.gs.activeUser.level === 100 ? 'Employee: ' + rec['employee'] + ' - User: ' + rec['id'] + '\r\n\r\n' : ''}Gebruiker degraderen naar normale gebruiker?`, 'Annuleer', 'Degradeer').then(b => {
          if (b === 2) {
            this.db.setDoc({level: 0}, `users/${rec['uid']}`, {merge: true})
          }
        })
      }
      return true
    }},
]

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: UserService,
  ) {
    super(dialogRef, entityService, injectorService)
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.colDef.find(cd => cd.name === 'uid')['format'] = (rec) => this.gs.activeUser.level === 100 ? rec['uid'] : ''
    this.formConfig = [
      {type: 'lookup',  label: 'Medewerker',    name: 'employee',     placeholder: 'Medewerker',    value: '', customLookupFld: {path: `tenants/${this.gs.tenantId}/employees`, tbl: 'employee', fld: 'address.name'}},
      {type: 'lookup',  label: 'Organisation',  name: 'organisation', placeholder: 'Organisation',  value: '', customLookupFld: {path: `tenants/${this.gs.tenantId}/organisations`, tbl: 'organisation', fld: 'address.name'}},
    ]
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    this.insertButton = false
    super.ngOnInit() // volgorde van belang!
  }

}
// this.gs.userLevel == 100 ? rec['uid'] : '-'
