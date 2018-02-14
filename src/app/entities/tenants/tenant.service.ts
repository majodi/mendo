import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { Tenant } from './tenant.model';
import { GlobService } from '../../services/glob.service';
import { DbService } from '../../services/db.service';

@Injectable()
export class TenantService {

  constructor(
    private af: AngularFirestore,
    private db: DbService,
    private glob: GlobService
  ) { }

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
