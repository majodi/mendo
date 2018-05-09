import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { Organisation } from './organisation.model';
import { GlobService } from '../../../services/glob.service';
import { EntityBaseClass } from '../../../baseclasses/entity';


@Injectable()
export class OrganisationService extends EntityBaseClass {
  entityName = 'organisations'
  basePath = `${this.glob.entityBasePath}`
  entityPath = `${this.basePath}/${this.entityName}`

  constructor(
    private afService: AngularFirestore,
    private glob: GlobService
  ) {
    super(afService)
    // if(this.glob.activeUser.level <= 25){
    //   this.entityQueries = [{fld: 'organisation', operator: '==', value: this.glob.activeUser.organisation}]
    // }
  }

}
