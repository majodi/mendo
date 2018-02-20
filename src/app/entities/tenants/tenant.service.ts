import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { GlobService } from '../../services/glob.service';
import { EntityBaseClass } from '../../shared/custom-components/baseclasses/entity';
import { Tenant } from './tenant.model';

@Injectable()
export class TenantService extends EntityBaseClass {
  entityName = 'tenants'
  basePath = `${this.glob.entityBasePath}`
  entityPath = `${this.entityName}`

  constructor(
    private afService: AngularFirestore,
    private glob: GlobService
  ) {super(afService)}

}
