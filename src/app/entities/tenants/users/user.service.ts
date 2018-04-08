import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { GlobService } from '../../../services/glob.service';
import { EntityBaseClass } from '../../../baseclasses/entity';

import { User } from '../../../models/user.model';

@Injectable()
export class UserService extends EntityBaseClass {
  entityName = 'users'
  basePath = ``
  entityPath = `${this.entityName}`

  constructor(
    private afService: AngularFirestore,
    private glob: GlobService
  ) {super(afService)}

}
