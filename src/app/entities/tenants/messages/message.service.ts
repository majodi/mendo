import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { GlobService } from '../../../services/glob.service';
import { EntityBaseClass } from '../../../baseclasses/entity';
import { Message } from './message.model';
import { DbService } from '../../../services/db.service';
import { Tenant } from '../tenant.model';
import { User } from '../../../models/user.model';
import { Organisation } from '../organisations/organisation.model';
import { Employee } from '../organisations/employees/employee.model';

@Injectable()
export class MessageService extends EntityBaseClass {
  entityName = 'messages'
  basePath = `${this.glob.entityBasePath}`
  entityPath = `${this.basePath}/${this.entityName}`

  constructor(
    private afService: AngularFirestore,
    private glob: GlobService,
    private db: DbService,
  ) {super(afService)}

  sendSystemMail(recipientType, recipientId, subject, message) {
    let sm = {}
    return this.db.getUniqueValueId('tenants', 'id', this.glob.tenantId).take(1).map((tenant: Tenant) => {
      if(tenant && tenant.address.email){
        sm['fromEmail'] = tenant.address.email
        sm['fromName'] = tenant.address.name
        sm['status'] = 'new'
        sm['channel'] = 'email'
        sm['recipientSource'] = recipientType == 'user' ? 'Gebruiker' : recipientType == 'organisation' ? 'Organisatie' : recipientType == 'employee' ? 'Medewerker' : ''
        sm['subject'] = subject
        sm['textContent'] = message
        if(recipientType == 'user' && recipientId){
          sm['user'] = recipientId
          return this.db.getDoc(`users/${recipientId}`).then((user: User) => {
            sm['recipientDesignation'] = `${user.displayName} <${user.email}>`
            sm['toList'] = [{name: user.displayName, email: user.email}]
            return this.db.addDoc(sm, `${this.basePath}/messages`)
          }).catch(err => console.log('could not get user as email recipient', err))
        }
        if(recipientType == 'organisation' && recipientId){
          sm['organisation'] = recipientId
          return this.db.getDoc(`${this.basePath}/organisations/${recipientId}`).then((organisation: Organisation) => {
            sm['recipientDesignation'] = `${organisation.address.name} <${organisation.address.email}>`
            sm['toList'] = [{name: organisation.address.name, email: organisation.address.email}]
            return this.db.addDoc(sm, `${this.basePath}/messages`)
          }).catch(err => console.log('could not get organisation as email recipient', err))
        }
        if(recipientType == 'employee' && recipientId){
          sm['employee'] = recipientId
          this.db.getDoc(`${this.basePath}/employees/${recipientId}`).then((employee: Employee) => {
            sm['recipientDesignation'] = `${employee.address.name} <${employee.address.email}>`
            sm['toList'] = [{name: employee.address.name, email: employee.address.email}]
            return this.db.addDoc(sm, `${this.basePath}/messages`)
          }).catch(err => console.log('could not get employee as email recipient', err))
        }
      } else {console.log('could not send mail, no tenant email address (as sender)'); return Promise.reject('could not send mail, no tenant email address (as sender)')}
    }).toPromise()
  }

}
