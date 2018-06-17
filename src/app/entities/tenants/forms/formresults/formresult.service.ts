import { Injectable } from '@angular/core'

import { AngularFirestore } from 'angularfire2/firestore'

import { GlobService } from '../../../../services/glob.service'
import { EntityBaseClass } from '../../../../baseclasses/entity'

import { FormResult } from './formresult.model'

@Injectable()
export class FormResultService extends EntityBaseClass {
  entityName = 'formresults'
  basePath = `${this.glob.entityBasePath}`
  entityPath = `${this.basePath}/${this.entityName}`

  constructor(
    private afService: AngularFirestore,
    private glob: GlobService
  ) {super(afService)}

}
