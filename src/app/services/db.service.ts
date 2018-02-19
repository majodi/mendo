import { Injectable, ElementRef } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Rx';

import { EntityMeta } from '../models/entity-meta.model';
import { AuthService } from './auth.service'; ///// hoeft niet meer met gs = globalSettings service
import { PopupService } from './popup.service';
import { FieldConfig } from '../shared/dynamic-form/models/field-config.interface';

@Injectable()
export class DbService {

  constructor(
    private db: AngularFirestore,
    private as: AuthService,
    private ps: PopupService
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

  insertDialog(config, rec, path) {
    return this.ps.formDialog(1, config, rec).then((frmResult: {response: string, value: {}}) => {
      if(frmResult && (frmResult.response == 'save')){
        return this.addDoc(this.fixSubProperties(frmResult.value), path)//.then(id => {}).catch(err => console.log(err))
      }
    })
  }

  changeDeleteDialog(config, rec, path) {
    return this.ps.formDialog(2, config, rec).then((frmResult: {response: string, value: {}}) => {
      if(frmResult && (frmResult.response == 'save')){
        return this.updateDoc(this.fixSubProperties(frmResult.value), `${path}/${rec['id']}`)//.catch(err => console.log(err))
      }
      if(frmResult && (frmResult.response == 'delete')){
        return this.deleteDoc(`tenants/${rec['id']}`)//.catch(err => console.log(err))
      }
    })
  }

  fixSubProperties(flatRec: {}) {
    // set flat result back to proper DB record, only two levels!
    let nestedRec = {}
    Object.keys(flatRec).map((key)=>{
      let dot = key.indexOf('.')
      if(dot != -1){
        let prefix = key.slice(0, dot)
        let postfix = key.slice(dot+1)
        nestedRec[prefix] = nestedRec[prefix] == undefined ? {} : nestedRec[prefix]
        nestedRec[prefix][postfix] = flatRec[key]
      } else {
        nestedRec[key] = flatRec[key]
      }
    })
    return nestedRec
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
  
}
