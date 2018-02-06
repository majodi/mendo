import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { Property } from './property.model';
import { GlobService } from '../../services/glob.service';

@Injectable()
export class PropertyService {

  constructor(
    private db: AngularFirestore,
    private glob: GlobService
  ) { }

  initProperties$() {
    return this.db.collection<Property>(`/tenants/${this.glob.tenantId}/properties`)
    .snapshotChanges()
    .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Property
        const id = a.payload.doc.id
        return { id, ...data }
      })
    })
  }

}
