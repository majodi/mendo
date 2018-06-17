import { Injectable } from '@angular/core'

import { AngularFirestore } from 'angularfire2/firestore'
import { Observable } from 'rxjs'

import { GlobService } from '../../../services/glob.service'
import { EntityBaseClass } from '../../../baseclasses/entity'
import { Order } from './order.model'


@Injectable()
export class OrderService extends EntityBaseClass {
  entityName = 'orders'
  basePath = `${this.glob.entityBasePath}`
  entityPath = `${this.basePath}/${this.entityName}`

  constructor(
    private afService: AngularFirestore,
    private glob: GlobService
  ) {
    super(afService)
    console.log('active user before setting ent q: ', this.glob.activeUser)
    if (this.glob.activeUser.level <= 25) {
      this.entityQueries = [{fld: 'organisation', operator: '==', value: this.glob.activeUser.organisation}]
    }
  }

}
