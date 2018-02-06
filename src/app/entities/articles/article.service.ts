import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { Article } from './article.model';
import { GlobService } from '../../services/glob.service';

@Injectable()
export class ArticleService {

  constructor(
    private db: AngularFirestore,
    private glob: GlobService
  ) { }

  initArticles$() {
    return this.db.collection<Article>(`/tenants/${this.glob.tenantId}/articles`)
    .snapshotChanges()
    .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Article
        const id = a.payload.doc.id
        return { id, ...data }
      })
    })
  }

}
