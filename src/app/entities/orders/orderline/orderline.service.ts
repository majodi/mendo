import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { OrderLine } from './orderline.model';
import { GlobService } from '../../../services/glob.service';

@Injectable()
export class OrderlineService {

  constructor(
    private db: AngularFirestore,
    private glob: GlobService
  ) { }

  initOrderLines$(OrderId) {
    return this.db.collection<OrderLine>(`/tenants/${this.glob.tenantId}/orders/${OrderId}/orderlines`)
    .snapshotChanges()
    .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as OrderLine
        const id = a.payload.doc.id
        return { id, ...data }
      })
    })
  }

}
