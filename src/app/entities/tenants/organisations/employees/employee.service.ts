import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { Employee } from './employee.model';
import { GlobService } from '../../../../services/glob.service';
import { EntityBaseClass } from '../../../../shared/custom-components/baseclasses/entity';

@Injectable()
export class EmployeeService extends EntityBaseClass {
  entityName = 'employee'
  basePath = `${this.glob.entityBasePath}`
  entityPath = `${this.basePath}/${this.entityName}`

  constructor(
    private afService: AngularFirestore,
    private glob: GlobService
  ) {super(afService)}

}
