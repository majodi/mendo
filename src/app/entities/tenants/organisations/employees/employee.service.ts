import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { Employee } from './employee.model';
import { GlobService } from '../../../../services/glob.service';
import { EntityBaseClass } from '../../../../baseclasses/entity';

@Injectable()
export class EmployeeService extends EntityBaseClass {
  entityName = 'employees'
  basePath = `${this.glob.entityBasePath}`
  entityPath = `${this.basePath}/${this.entityName}`

  constructor(
    private afService: AngularFirestore,
    private glob: GlobService
  ) {
    super(afService)
    if(this.glob.activeUser.level <= 25){
      this.entityQueries = [{fld: 'organisation', operator: '==', value: this.glob.activeUser.organisation}]
    }
  }

}
