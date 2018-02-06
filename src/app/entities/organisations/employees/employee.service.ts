import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { Employee } from './employee.model';
import { GlobService } from '../../../services/glob.service';

@Injectable()
export class EmployeeService {

  constructor(
    private db: AngularFirestore,
    private glob: GlobService
  ) { }

  initEmployees$(organisationId: string) {
    return this.db.collection<Employee>(`/tenants/${this.glob.tenantId}/organisations/${organisationId}/employees`)
    .snapshotChanges()
    .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Employee
        const id = a.payload.doc.id
        return { id, ...data }
      })
    })
  }

}
