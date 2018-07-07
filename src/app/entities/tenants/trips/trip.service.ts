import { Injectable } from '@angular/core'

import { AngularFirestore } from 'angularfire2/firestore'

import { Trip } from './trip.model'
import { GlobService } from '../../../services/glob.service'
import { EntityBaseClass } from '../../../baseclasses/entity'


@Injectable()
export class TripService extends EntityBaseClass {
  entityName = 'trips'
  basePath = `${this.glob.entityBasePath}`
  entityPath = `${this.basePath}/${this.entityName}`

  constructor(
    private afService: AngularFirestore,
    private glob: GlobService
  ) {
    super(afService)
  }

}
