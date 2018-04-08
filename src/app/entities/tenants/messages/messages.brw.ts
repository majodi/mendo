import { Component, OnInit, OnDestroy, Injector, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template';
import { Message, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './message.model'
import { MessageService } from './message.service';

import { BrwBaseClass } from '../../../baseclasses/browse';
import { UsersBrwComponent } from '../users/users.brw';
import { EmployeesBrwComponent } from '../organisations/employees/employees.brw';
import { OrganisationService } from '../organisations/organisation.service';
import { Embed } from '../../../shared/dynamic-form/models/embed.interface';

@Component({
  selector: 'app-messages-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class MessagesBrwComponent extends BrwBaseClass<Message[]> implements OnInit, OnDestroy {
embeds: Embed[] = [
    {type: 'onValueChg', code: (ctrl, value) => {
        if(ctrl == 'status'){
            this.formConfig[this.formConfig.findIndex(c => c.name == 'statusDisplay')].value = {new: 'Nieuw', send: 'Verzenden', sent: 'Verzonden'}[value]
        }
        if(ctrl == 'channel'){
            if(value == 'email'){
                this.formConfig[this.formConfig.findIndex(c => c.name == 'recipientSource')].options = ['Gebruiker', 'Organisatie', 'Medewerker'] 
            } else {
                this.formConfig[this.formConfig.findIndex(c => c.name == 'recipientSource')].options = ['Gebruiker', 'Medewerker']
                this.formConfig[this.formConfig.findIndex(c => c.name == 'organisation')].hidden = true
            }
            return
        }
        if(ctrl == 'recipientSource'){
            if(value == 'Gebruiker'){
                this.formConfig[this.formConfig.findIndex(c => c.name == 'user')].hidden = false
                this.formConfig[this.formConfig.findIndex(c => c.name == 'organisation')].hidden = true
                this.formConfig[this.formConfig.findIndex(c => c.name == 'employee')].hidden = true
            }
            if(value == 'Organisatie'){
                this.formConfig[this.formConfig.findIndex(c => c.name == 'user')].hidden = true
                this.formConfig[this.formConfig.findIndex(c => c.name == 'organisation')].hidden = false
                this.formConfig[this.formConfig.findIndex(c => c.name == 'employee')].hidden = true
            }
            if(value == 'Medewerker'){
                this.formConfig[this.formConfig.findIndex(c => c.name == 'user')].hidden = true
                this.formConfig[this.formConfig.findIndex(c => c.name == 'organisation')].hidden = true
                this.formConfig[this.formConfig.findIndex(c => c.name == 'employee')].hidden = false
            }
        }
    }},
    {type: 'beforeSave', code: (action, o) => {
        // if(action == 1){
        // o['order'] = this.selectedOrder
        // o['amount'] = o['number'] * o['price_unit'] //last update for if user pressed enter
        // for (var key in o){
        //     if(o[key] == undefined) {
        //     o[key] = null
        //     }
        // }
        // return Promise.resolve()
        // } else return Promise.resolve()  
    }}
]
    
  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: MessageService,
    private organisationSrv: OrganisationService
  ) {
    super(dialogRef, entityService, injectorService);
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig.map(x => Object.assign({}, x));
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    super.setLookupComponent(UsersBrwComponent, 'user', 'displayName', 'email')
    super.setLookupComponent(EmployeesBrwComponent, 'employee', 'address.name', 'address.city')
    super.setPulldownItems(this.organisationSrv.initEntity$(), 'organisation', 'address.name', 'address.city')
    super.ngOnInit() //volgorde van belang!
  }

}
