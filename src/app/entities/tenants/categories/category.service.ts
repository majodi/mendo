import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { GlobService } from '../../../services/glob.service';
import { EntityBaseClass } from '../../../baseclasses/entity';
import { Category } from './category.model';

@Injectable()
export class CategoryService extends EntityBaseClass {
  entityName = 'categories'
  basePath = `${this.glob.entityBasePath}`
  entityPath = `${this.basePath}/${this.entityName}`

  constructor(
    private afService: AngularFirestore,
    private glob: GlobService
  ) {super(afService)}

}
