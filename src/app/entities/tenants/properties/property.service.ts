import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { GlobService } from '../../../services/glob.service';
import { Property } from './property.model';

@Injectable()
export class PropertyService {
  entityPath: string

  constructor(
    private af: AngularFirestore,
    private glob: GlobService
  ) { this.entityPath = `tenants/${this.glob.tenantId}/properties` }

  initProperties$() {
    return this.af.collection<Property>(this.entityPath)
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
