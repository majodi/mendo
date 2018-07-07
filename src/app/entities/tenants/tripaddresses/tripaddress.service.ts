import { Injectable } from '@angular/core'

import { AngularFirestore } from 'angularfire2/firestore'

import { TripAddress } from './tripaddress.model'
import { GlobService } from '../../../services/glob.service'
import { EntityBaseClass } from '../../../baseclasses/entity'


@Injectable()
export class TripAddressService extends EntityBaseClass {
  entityName = 'tripaddresses'
  basePath = `${this.glob.entityBasePath}`
  entityPath = `${this.basePath}/${this.entityName}`

  constructor(
    private afService: AngularFirestore,
    private glob: GlobService
  ) {
    super(afService)
  }

}
