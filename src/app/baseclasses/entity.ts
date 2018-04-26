import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/firestore';

import { FieldConfig } from '../shared/dynamic-form/models/field-config.interface';
import { QueryItem } from '../models/query-item.interface';
import { ColumnDefenition } from '../shared/custom-components/models/column-defenition.model';

export class EntityBaseClass {
  entityName: string  
  basePath: string
  entityPath: string
  formConfig: FieldConfig[]
  colDef: ColumnDefenition[]
  entityQueries: QueryItem[] = []

  constructor(
    private af: AngularFirestore,
  ) {}

  initEntity$(queries?: QueryItem[]) {
    let entity$ = this.af.collection(this.entityPath, ref => {
      let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      const entryQueries = queries ? queries.concat(this.entityQueries) : this.entityQueries.length > 0 ? this.entityQueries : []
      if (entryQueries && entryQueries.length > 0){
        entryQueries.forEach(q => {
          if (q.value) { query = q.fld.indexOf('tag') < 0 ? query.where(q.fld, q.operator, q.value) : query.where(`${q.fld}.${Object.keys(q.value)[0]}`, '==', true)}
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
      const virtualFields = this.colDef.map((item) => item.name);
      return this.formConfig.filter(c => (c.customLookupFld != undefined) && (virtualFields.includes(c.name+'_v'))).reduce((acc, val) => {
        const adjustedBasePath = this.basePath ? this.basePath+'/' : '' //for root tables
        return acc.switchMap(actions => {
          let lookupDocObservables = actions.map((action) => {
            if(action[val.name]){
              return this.af.doc(`${adjustedBasePath}${val.customLookupFld.path}/${action[val.name]}`).valueChanges().first()
            } else {
              return Observable.of(null)
            }
          })
          return lookupDocObservables.length === 0 ? Observable.of(actions) : Observable.combineLatest(...lookupDocObservables, (...lookupDocs) => {
            actions.forEach((action, index) => {
              action[val.name+'_v'] = lookupDocs[index] != null ? this.objectValue(lookupDocs[index], val.customLookupFld.overruleVirtual != undefined ? val.customLookupFld.overruleVirtual : val.customLookupFld.fld) : ''
            })
            return actions
          })      
        })
      }, entity$)  
    } else return entity$
  }

  objectValue(o, key) {
    // console.log('o in entity: ', o)
    //also only two levels!!
    let keys = key.split('.')
    if(keys.length == 2) {
      return o[keys[0]][keys[1]]
    } else return o[key]
  }

}
