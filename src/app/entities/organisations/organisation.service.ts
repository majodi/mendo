import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { Organisation } from './organisation.model';
import { GlobService } from '../../services/glob.service';

@Injectable()
export class OrganisationService {

  constructor(
    private db: AngularFirestore,
    private glob: GlobService
  ) { }

  initOrganisations$() {
    return this.db.collection<Organisation>(`/tenants/${this.glob.tenantId}/organisations`)
    .snapshotChanges()
    .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Organisation
        const id = a.payload.doc.id
        return { id, ...data }
      })
    })
  }

}
