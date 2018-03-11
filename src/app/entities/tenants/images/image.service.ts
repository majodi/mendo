import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { GlobService } from '../../../services/glob.service';
import { EntityBaseClass } from '../../../baseclasses/entity';
import { Image } from './image.model';

@Injectable()
export class ImageService extends EntityBaseClass {
  entityName = 'images'
  basePath = `${this.glob.entityBasePath}`
  entityPath = `${this.basePath}/${this.entityName}`

  constructor(
    private afService: AngularFirestore,
    private glob: GlobService
  ) {super(afService)}

}
