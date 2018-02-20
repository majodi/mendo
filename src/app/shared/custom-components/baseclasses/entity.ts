import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/firestore';

import { FieldConfig } from '../../../shared/dynamic-form/models/field-config.interface';

export class EntityBaseClass {
  basePath: string
  entityPath: string
  formConfig: FieldConfig[]

  constructor(
    private af: AngularFirestore,
  ) {}

  initEntity$(selection?: any) {
    let entity$ = this.af.collection(this.entityPath, ref => {
      let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      if (selection){
        Object.keys(selection).forEach(qf => {
          if (selection[qf]) { query = query.where(qf, '==', selection[qf]) };          
        })
      }
      return query;
    })
    .snapshotChanges()
    .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id
        return { id, ...data }
      })
    })
    if(this.formConfig){
      return this.formConfig.filter(c => c.customLookupFld != undefined).reduce((acc, val) => {
        return acc.switchMap(actions => {
          let lookupDocObservables = actions.map((action) => {
            if(action[val.name]){
              return this.af.doc(`${this.basePath}/${val.customLookupFld.path}/${action[val.name]}`).valueChanges().first()
            } else {
              return Observable.of(null)
            }
          })
          return lookupDocObservables.length === 0 ? Observable.of(actions) : Observable.combineLatest(...lookupDocObservables, (...lookupDocs) => {
            actions.forEach((action, index) => {
              action[val.name+'_v'] = lookupDocs[index] != null ? lookupDocs[index][val.customLookupFld.fld] : ''
            })
            return actions
          })      
        })
      }, entity$)  
    } else return entity$
  }

}
