import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { GlobService } from '../../../services/glob.service';
import { Category } from './category.model';

@Injectable()
export class CategoryService {
  entityPath: string

  constructor(
    private af: AngularFirestore,
    private glob: GlobService
  ) { this.entityPath = `tenants/${this.glob.tenantId}/categories` }

  initCategories$() {
    return this.af.collection<Category>(this.entityPath)
    .snapshotChanges()
    .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Category
        const id = a.payload.doc.id
        return { id, ...data }
      })
    })
  }

}
