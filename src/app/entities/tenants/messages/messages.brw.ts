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
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { Organisation } from '../organisations/organisation.model';
import { Employee } from '../organisations/employees/employee.model';

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
            if(value != 'new'){
                this.formConfig.forEach(c => c.hidden = true)
                this.formConfig[this.formConfig.findIndex(c => c.name == 'recipientDesignation')].hidden = false
                this.formConfig[this.formConfig.findIndex(c => c.name == 'subject')].readOnly = true //hidden werkt niet on input flds
                this.formConfig[this.formConfig.findIndex(c => c.name == 'textContent')].readOnly = true
            }
            return
        }
        if(ctrl == 'channel'){
            let recipientSourceIndex = this.formConfig.findIndex(c => c.name == 'recipientSource')
            if(value){
                this.formConfig[recipientSourceIndex].hidden = false
                let statusDisplayIndex = this.formConfig.findIndex(c => c.name == 'statusDisplay')
                if(!this.formConfig[statusDisplayIndex].value) {
                    this.formConfig[statusDisplayIndex].hidden = false
                    this.formConfig[statusDisplayIndex].value = 'Nieuw'
                    this.formConfig[this.formConfig.findIndex(c => c.name == 'status')].value = 'new'
                }
            }
            if(value == 'email'){
                this.formConfig[recipientSourceIndex].options = ['Gebruiker', 'Organisatie', 'Medewerker'] 
            } else {
                this.formConfig[recipientSourceIndex].options = ['Gebruiker', 'Medewerker']
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
        o.fromEmail = this.as.user.email
        o.fromName = this.as.user.displayName
        if(o.recipientSource == 'Gebruiker'){
            return this.db.getDoc(`users/${o.user}`).then((user: User) => {
                if(o.channel == 'email'){
                    o.recipientDesignation = `${user.displayName} <${user.email}>`
                    o.toList = [{name: user.displayName, email: user.email}]    
                } else {
                    o.recipientDesignation = `${user.displayName} <push>`
                    o.subscriptionList = user.pushSubscriptions
                }
            })
        }
        if(o.recipientSource == 'Organisatie'){
            return this.db.getDoc(`${this.gs.entityBasePath}/organisations/${o.organisation}`).then((organisation: Organisation) => {
                if(o.channel == 'email'){
                    o.recipientDesignation = `${organisation.address.name} <${organisation.address.email}>`
                    o.toList = [{name: organisation.address.name, email: organisation.address.email}]
                }
            })
        }
        if(o.recipientSource == 'Medewerker'){
            return this.db.getDoc(`${this.gs.entityBasePath}/employees/${o.employee}`).then((employee: Employee) => {
                if(o.channel == 'email'){
                    o.recipientDesignation = `${employee.address.name} <${employee.address.email}>`
                    o.toList = [{name: employee.address.name, email: employee.address.email}]    
                } else {
                    return this.db.getUniqueValueId(`users`, 'employee', o.employee).take(1).map((user: User) => {
                        if(user){
                            o.recipientDesignation = `${employee.address.name} <push>`
                            o.subscriptionList = user.pushSubscriptions
                            o.dataObject = {
                                "notification": {
                                    "title": o.subject,
                                    "body": o.textContent,
                                    "icon": "assets/android-chrome-192x192.png",
                                    "data": {},
                                    "actions": [{}]
                                }
                            }    
                        } else {return Promise.reject('no connected User')}
                    }).toPromise()
                }
            })
        }
    }},
    {type: 'beforeChgDialog', code: (rec, fld) => {
        if(fld == 'status' && rec.status == 'new' && !this.selectMode){
            return this.ps.buttonDialog('Berich versturen?', 'Verstuur', 'Annuleer').then(b => {
                if(b == 1){
                    return this.db.updateDoc({status: 'send'}, `${this.gs.entityBasePath}/messages/${rec['id']}`).then(v => {
                        return true
                    }).catch(v => {
                        return false
                    })        
                } else {return false}
            })
        } else {
            return false
        }
    }},    
]

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: MessageService,
    private organisationSrv: OrganisationService,
    private as: AuthService
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
