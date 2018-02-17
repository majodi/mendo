import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { Tenant } from './tenant.model';

@Injectable()
export class TenantService {
  entityPath: string

  constructor(
    private af: AngularFirestore,
  ) { this.entityPath = `tenants` }

  initTenants$() {
    return this.af.collection<Tenant>(`tenants`)
    .snapshotChanges()
    .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Tenant
        const id = a.payload.doc.id
        return { id, ...data }
      })
    })
  }

}
