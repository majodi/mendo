import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { Order } from './order.model';
import { GlobService } from '../../services/glob.service';

@Injectable()
export class OrderService {

  constructor(
    private db: AngularFirestore,
    private glob: GlobService
  ) { }

  initOrders$() {
    return this.db.collection<Order>(`/tenants/${this.glob.tenantId}/orders`)
    .snapshotChanges()
    .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Order
        const id = a.payload.doc.id
        return { id, ...data }
      })
    })
  }

  nextOrderNumber() {
      todo!! met observer in sync houden ivm caching
  }

}
