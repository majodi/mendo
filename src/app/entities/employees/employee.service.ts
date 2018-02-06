import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { Employee } from './employee.model';
import { GlobService } from '../../services/glob.service';

@Injectable()
export class EmployeeService {

  constructor(
    private db: AngularFirestore,
    private glob: GlobService
  ) { }

  initArticle$() {
    return this.db.collection<Employee>(`${this.glob.tenantPath}/employee`)
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
