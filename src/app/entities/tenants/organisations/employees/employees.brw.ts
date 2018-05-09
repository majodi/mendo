import { Component, OnInit, OnDestroy, Injector } from '@angular/core';

import { defaultTableTemplate } from '../../../../shared/custom-components/models/table-template';
import { Employee, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig, defaultSelectionFields } from './employee.model'
import { EmployeeService } from './employee.service';
import { OrganisationService } from '../organisation.service';
import { PropertyService } from '../../properties/property.service';

import { BrwBaseClass } from '../../../../baseclasses/browse';
import { MatDialogRef } from '@angular/material';
import { Embed } from '../../../../shared/dynamic-form/models/embed.interface';
import { Organisation } from '../organisation.model';
import { Property } from '../../properties/property.model';
import { FieldConfig } from '../../../../shared/dynamic-form/models/field-config.interface';
import { MessageService } from '../../messages/message.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-employees-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class EmployeesBrwComponent extends BrwBaseClass<Employee[]> implements OnInit, OnDestroy {
  emailOnEntry = ''
  nameOnEntry = ''
  APFormConfig: FieldConfig[]
  embeds: Embed[] = [
    {type: 'onValueChg', code: (ctrl, value, formAction?) => {
      if(ctrl == 'organisation'){
        const branchChoices = this.formConfig[this.formConfig.findIndex(c => c.name == 'branchChoices')].value
        this.formConfig[this.formConfig.findIndex(c => c.name == 'branch')].options = branchChoices ? branchChoices.split(',') : []
      }
      if(ctrl == 'address.email'){
        if(formAction == undefined && value && value != this.emailOnEntry){
          this.db.syncEmailRecord(value, this.formConfig, 'address.name', 'medewerker')
        } else {
          this.emailOnEntry = value
        }
      }
      if(ctrl == 'address.name'){
        if(formAction == undefined && value && this.emailOnEntry && value != this.nameOnEntry){
          this.db.syncEmailRecord(this.emailOnEntry, this.formConfig, 'address.name', 'medewerker')
        } else {
          this.nameOnEntry = value
        }
      }
    }},
    {type: 'beforeChgDialog', code: (rec, fld) => {
      return this.beforeForm(rec, fld)
    }},
    {type: 'beforeInsertDialog', code: (rec, fld) => {
      return this.beforeForm(rec, fld)
    }},
    {type: 'beforeSave', code: (action, o) => {
      if(this.gs.backButton){
        o['organisation'] = this.gs.NavQueries.find(q => q.fld == 'organisation').value
      }
      return Promise.resolve()
    }},
  ]

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: EmployeeService,
    private organisationSrv: OrganisationService,
    private propertySrv: PropertyService,
    private messageSrv: MessageService,
    private router: Router,
    private as: AuthService,
  ) {
    super(dialogRef, entityService, injectorService);
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig.map(x => Object.assign({}, x));
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    this.selectionFields = defaultSelectionFields
    super.setPulldownItems(this.organisationSrv.initEntity$(), 'organisation', 'address.name', 'address.city')
    super.ngOnInit() //volgorde van belang!
  }

  beforeForm(rec: Employee, fld) {
    if(fld == 'orderAs'){
      const winkelNavItem = this.as.navList.find(nl => nl['text'] == 'Winkel')
      if(winkelNavItem){
        this.db.getFirst(`users`, [{fld: 'employee', operator: '==', value: rec['id']}]).subscribe((user: User) => {
          this.gs.orderAs = user
          this.router.navigate([winkelNavItem['link']])
        })
        return true
      } else {
        this.ps.buttonDialog('Winkelmodule niet actief', 'OK')  
      }
      return true
    }
    if(fld == 'propertiesAllowed'){
      this.allowedPropertiesForm(rec)
      return true
    }
    if(fld == 'verificationCode'){
      this.db.getFirst('users', [{fld:'email', operator:'==', value:rec.address.email}]).take(1).toPromise().then(user => {
        if(user && user['uid'] != undefined){
          // let email = rec.address.email ? user['uid'] != undefined ? rec.address.email : rec.address.email + '(Geen account voor emailadres)' : '(Geen emailadres ingevuld)'
          let email = rec.address.email ? rec.address.email : '(Geen emailadres ingevuld)'
          this.ps.buttonDialog(`Bestaand gekoppeld Account gevonden\r\n\r\nMedewerker:\r\n${rec.address.name}\r\n${email}\r\n\r\nVerificatiecode: ${rec.id}`, 'Sluit', rec.address.email ? 'Stuur email' : undefined, undefined, rec.id).then(b => {
            if(b == 2){
              const link = user['uid'] != undefined && this.gs.tenantId != undefined && rec.id != undefined ? `https://us-central1-mendo-app.cloudfunctions.net/verifyemployee?user=${user['uid']}&tenant=${this.gs.tenantId}&code=${rec.id}` : 'Verificatiecode: '+rec.id
              const usage = user['uid'] != undefined && this.gs.tenantId != undefined && rec.id != undefined ? 'Klik op onderstaande link om uw account te verifiëren:' : 'Voer onderstaande code in bij "Verificatie" in uw profiel (klik rechtsboven in de blauwe balk en kies Profiel):'
              this.messageSrv.sendSystemMail('employee', rec.id, 'Verificatiecode '+this.gs.tenantName, `
  Beste ${rec.address.name},
  
  Hierbij ontvangt u de verificatiecode voor het bestelsysteem van ${this.gs.tenantName}. Deze code wordt gebruikt om uw account te koppelen aan het bedrijf waar u werkzaam bent zodat u bestellingen kunt plaatsen.
  
  ${usage}
  
  ${link}
  
  Met vriendelijke groet,
  
  ${this.gs.tenantName}
              `)
              .then(() => {this.ps.buttonDialog('Mail verstuurd naar: '+email, 'OK')})
              .catch(err => {this.ps.buttonDialog('Fout bij versturen:'+err, 'OK')})
            }
          })  
        } else {
          let email = rec.address.email ? rec.address.email : '(Geen emailadres ingevuld)'
          this.ps.buttonDialog(`Geen gekoppeld Account gevonden\r\n\r\nMedewerker:\r\n${rec.address.name}\r\n${email}\r\n\r\nAccount aanmaken en koppelen?`, 'Annuleer', rec.address.email ? 'Aanmaken' : undefined).then(b => {
            if(b == 2){
              //call backend
              this.as.createAndLinkAccount(rec.id).toPromise()
              .then(res => {
                console.log('res: ', res.body)
                this.ps.buttonDialog(`Account ${rec.address.name} succesvol gecreëerd\r\n\r\nInitieel wachtwoord:\r\n${res.body}`, 'Sluit', 'Stuur email', undefined, res.body).then(b => {
                  if(b == 2){
                    this.messageSrv.sendSystemMail('employee', rec.id, 'Inloggegevens '+this.gs.tenantName, `
Beste ${rec.address.name},

Hierbij ontvangt u de inloggegevens voor het bestelsysteem van ${this.gs.tenantName}. Om een bestelling te kunnen plaatsen dient u zich aan te melden met onderstaande gegevens.

Aanmelden met:

Email: ${rec.address.email}
Wachtwoord: ${res.body}


Met vriendelijke groet,

${this.gs.tenantName}
                    `)
                    .then(() => {this.ps.buttonDialog('Mail verstuurd naar: '+ rec.address.email, 'OK')})
                    .catch(err => {this.ps.buttonDialog('Fout bij versturen:'+ err, 'OK')})                      
                  }
                })
              })
              .catch(e => {
                console.log('error createAndLinkAccount: ', e.error)
                this.ps.buttonDialog(`Fout bij aanmaak nieuw account:\r\n\r\n${e.error}`, 'OK')
              })
            }
          })
        }
      })
      return true
    }
    this.emailOnEntry = ''
    this.nameOnEntry = ''
    const organisationConfig = this.formConfig.find(fc => fc.name == 'organisation')
    const branchConfig = this.formConfig.find(fc => fc.name == 'branch')
    //TODO: if backbutton maar ook als entity query bevat org!! (ook before save vullen hierboven)
    if(this.gs.backButton && organisationConfig != undefined){
      organisationConfig.doNotPopulate = true
      const organisation = this.gs.NavQueries.find(q => q.fld == 'organisation').value
      if(organisation != undefined && branchConfig != undefined){
        this.db.getDoc(`${this.gs.entityBasePath}/organisations/${organisation}`).then((o: Organisation) => {
          branchConfig.options = o.branches ? o.branches.split(',') : []
        })
      }
    }
    return false
  }

  allowedPropertiesForm(rec: Employee) {
    this.propertySrv.initEntity$().take(1).takeUntil(this.ngUnsubscribe).subscribe(properties => {
      let formValues = {propertiesAllowed: rec.propertiesAllowed}
      this.APFormConfig = [{type: 'stringdisplay', label: 'Keuzes', name: 'header', placeholder: 'Keuzes', value: 'Definieer per categorie (waar wenselijk) een subselectie van toegestane keuzes'}]
      properties.forEach((property: Property) => {
        this.APFormConfig.push({type: 'checkbox', label: 'Subselectie voor: '+property.code, name: 'propertiesAllowed.'+property.id, placeholder: 'Subselectie voor: '+property.code, value: rec.propertiesAllowed ? rec.propertiesAllowed[property.id] : false})
        this.APFormConfig.push({type: 'chiplist', label: 'Toegestaan', name: 'propertiesAllowed.'+property.id, placeholder: 'Toegestaan', value: rec.propertiesAllowed && rec.propertiesAllowed[property.id] ? rec.propertiesAllowed[property.id].split(',').reduce((result, item) => {result[item] = true; return result}, {}) : {}, options: property.choices.split(',').map(i => i.trim()), hidden: rec.propertiesAllowed ? !rec.propertiesAllowed[property.id] : true})
      })
      this.ps.formDialog(2, this.APFormConfig, formValues, (ctrl, value) => {this.formValChg(ctrl, value)}).then(res => {
        if(res && res['response'] == 'save'){
          let newAllowed = {}
          Object.keys(res.value).forEach(p => {
            if(p != 'header'){
              const keys = Object.keys(res.value[p])
              if(keys.length > 0){
                newAllowed[p.split('.')[1]] = keys.join(',')
              }
            }
          })
          this.db.updateDoc({propertiesAllowed: newAllowed}, `${this.gs.entityBasePath}/employees/${rec.id}`)
        }
      })
    })
  }

  formValChg(ctrl: string, value) {
    const chiplistConfig = this.APFormConfig.find(c => c.type == 'chiplist' && c.name == ctrl)
    if(typeof value == 'boolean'){
      chiplistConfig.hidden = !chiplistConfig.hidden
      if(chiplistConfig.hidden)chiplistConfig.value = {};
    }
  }

}
