import { Injectable } from '@angular/core'

import { AngularFirestore } from 'angularfire2/firestore'

import { GlobService } from '../../../../services/glob.service'
import { EntityBaseClass } from '../../../../baseclasses/entity'

import { FormField } from './formfield.model'

@Injectable()
export class FormFieldService extends EntityBaseClass {
  entityName = 'formfields'
  basePath = `${this.glob.entityBasePath}`
  entityPath = `${this.basePath}/${this.entityName}`

  constructor(
    private afService: AngularFirestore,
    private glob: GlobService
  ) {super(afService)}

}
