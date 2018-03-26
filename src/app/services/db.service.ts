import { Injectable, ElementRef } from '@angular/core';

import { AngularFirestore, DocumentChangeAction } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import * as firestore from 'firebase/firestore';
import { Observable } from 'rxjs/Rx';

import { EntityMeta } from '../models/entity-meta.model';
import { AuthService } from './auth.service'; ///// hoeft niet meer met gs = globalSettings service, later verbeteren
// import { PopupService } from './popup.service'; CAN NOT ADD - Circular refference!!
import { UploadService } from './upload.service';
import { GlobService } from './glob.service';
import { FieldConfig } from '../shared/dynamic-form/models/field-config.interface';
import { DocumentData } from '@firebase/firestore-types';
import { Setting } from '../entities/tenants/settings/setting.model';
import { QueryItem } from '../models/query-item.interface';

@Injectable()
export class DbService {

  constructor(
    private db: AngularFirestore,
    private as: AuthService,
    private us: UploadService,
    private gs: GlobService,
  ) { }

  getMeta(): EntityMeta {
    let now = new Date()
    let meta = {
      creator:  this.as.user.uid,
      created:  now.toISOString(),
      modifier: this.as.user.uid,
      modified: now.toISOString()
    }
    return meta    
  }

  getSetting(code: string | string[]): Observable<string> {
    if(code && (typeof code == 'string') && (code.indexOf('SETTINGS:') != -1)){
      code = code.split(':')[1]
      if(code){
        return this.getUniqueValueId(this.gs.entityBasePath+'/settings', 'code', code).map((rec: Setting) => rec != undefined ? rec.setting : '')
      } else return Observable.of(null)
    } else return Observable.of(null)
  }

  addDoc(data, collection: string) {
    data.meta = this.getMeta()
    return this.db.collection(collection).add(data)
  }

  setDoc(data, path: string) {
    return this.db.doc(path).set(data)
  }

  updateDoc(data, path: string) {
    return this.db.doc(path).update(data)
  }

  updateWithQuery(data, collection: string, queries?: QueryItem[]) {
    this.db.collection(collection, ref => {
      let query : firebase.firestore.CollectionReference | firestore.firestore.Query = ref;
      if(queries){
        queries.forEach(q => {
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
    .subscribe(items => {
      items.forEach(item => {
        this.db.doc(`${collection}/${item.id}`).update(data)
      })
    })
  }

  deleteDoc(path: string) {
    return this.db.doc(path).delete()
  }

  getDoc(path) {
    return new Promise((resolve, reject) => {
      this.db.doc(path).snapshotChanges().take(1).toPromise().then(data => {
        if(data.payload.exists) {resolve(data.payload.data())} else {reject('no such document!')}
      })
    })
  }

  getFirst(collection: string, queries: QueryItem[]) {
    return this.db.collection(collection, ref => {
      let query : firebase.firestore.CollectionReference | firestore.firestore.Query = ref;
      if (queries){
        queries.forEach(q => {
          if (q.value) { query = q.fld.indexOf('tag') < 0 ? query.where(q.fld, q.operator, q.value) : query.where(`${q.fld}.${Object.keys(q.value)[0]}`, '==', true)}
        })
      }
      return query.limit(1);
    })
    .snapshotChanges()
    .map(actions => {
      if(actions.length > 0){
        const data = actions[0].payload.doc.data()
        const id = actions[0].payload.doc.id
        return { id, ...data }
      } else {return {}}
    }).take(1)
  }

  getCount(collection: string, queries: QueryItem[]) {
    return this.db.collection(collection, ref => {
      let query : firebase.firestore.CollectionReference | firestore.firestore.Query = ref;
      if (queries){
        queries.forEach(q => {
          if (q.value) { query = q.fld.indexOf('tag') < 0 ? query.where(q.fld, q.operator, q.value) : query.where(`${q.fld}.${Object.keys(q.value)[0]}`, '==', true)}
        })
      }
      return query;
    })
    .snapshotChanges()
    .map(children => {
      return children.length
    })
  }

  getIncrementedCounter(counterName: string) {
    let new_count = 0
    const counterRef = firebase.firestore().doc(`${this.gs.entityBasePath}/settings/${counterName}`)
    return firebase.firestore().runTransaction(t => {
      return t.get(counterRef).then(doc => {
          if(doc.exists){new_count = doc.data().count + 1}
          t.set(counterRef, { count: new_count });
      })
    }).then(v => {return new_count})
  }

  getUniqueValueId(collection: string, field: string, value: string, asNumber?: boolean) {
    if(value){
      if(field == 'id'){
        return this.db.doc(collection+'/'+value).snapshotChanges().map(rec => {
          return {id: value, ...rec.payload.data()}
        })
      } else {
        let startAt, endAt
        if(asNumber != undefined && asNumber == true){
          startAt = Number(value)
          endAt = Number(value)
        } else {
          const lsPart = value.slice(0,value.length-1)
          const msPartASCII = value.charCodeAt(value.length-1)
          startAt = lsPart+String.fromCharCode(msPartASCII-1)
          endAt = lsPart+String.fromCharCode(msPartASCII+1)  
        }
        return this.db.collection(collection, ref => ref
        .limit(2)
        .orderBy(field)
        .startAt(startAt).endAt(endAt))
        .snapshotChanges().map(recs => {
          if(recs.length == 1) return {id: recs[0].payload.doc.id, ...recs[0].payload.doc.data()}; else return null;
        })    
      }  
    } else return Observable.of(null)
  }

}
