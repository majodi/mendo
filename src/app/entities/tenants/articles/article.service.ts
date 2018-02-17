import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { Subject, Observable } from 'rxjs';

import { GlobService } from '../../../services/glob.service';
import { Article } from './article.model';
import { Category } from '../categories/category.model';

@Injectable()
export class ArticleService {
  entityPath: string

  constructor(
    private af: AngularFirestore,
    private glob: GlobService
  ) { this.entityPath = `tenants/${this.glob.tenantId}/articles` }

  initArticles$() {
    return this.af.collection<Article>(this.entityPath)
    .snapshotChanges()
    .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Article
        const id = a.payload.doc.id
        const category_categoryCode = ''
        return { id, category_categoryCode, ...data }
      })
    })
    .switchMap(actions => {
      let categoryDocObservables = actions.map((action: Article) => {
        if(action.category){
          return this.af.doc<Category>(`tenants/${this.glob.tenantId}/categories/${action.category}`).valueChanges().first()
        } else {
          return Observable.of(null)
        }
      })
      return categoryDocObservables.length === 0 ? Observable.of(actions) : Observable.combineLatest(...categoryDocObservables, (...categoryDocs) => {
        actions.forEach((action: Article, index) => {
          action.category_categoryCode = categoryDocs[index] != null ? categoryDocs[index].code : ''
        })
        return actions
      })
    })      
  }

}
