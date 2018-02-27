import { Injectable, ElementRef } from '@angular/core';

import { AngularFirestore, DocumentChangeAction } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Rx';

import { EntityMeta } from '../models/entity-meta.model';
import { AuthService } from './auth.service'; ///// hoeft niet meer met gs = globalSettings service
import { PopupService } from './popup.service';
import { UploadService } from './upload.service';
import { GlobService } from './glob.service';
import { FieldConfig } from '../shared/dynamic-form/models/field-config.interface';
import { DocumentData } from '@firebase/firestore-types';
import { Setting } from '../entities/tenants/settings/setting.model';

@Injectable()
export class DbService {

  constructor(
    private db: AngularFirestore,
    private as: AuthService,
    private ps: PopupService,
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

  insertDialog(config, rec, path) {
    config.forEach(config => this.getSetting(config.options).subscribe(setting => config.options = setting ? setting : config.options))
    return this.ps.formDialog(1, config, rec).then((frmResult: {response: string, value: {}}) => {
      if(frmResult && (frmResult.response == 'save')){
        return this.addDoc(this.fixSubProperties(frmResult.value), path)//.then(id => {}).catch(err => console.log(err))
      }
    })
  }

  changeDeleteDialog(config, rec, path) {
    config.forEach(config => this.getSetting(config.options).subscribe(setting => config.options = setting ? setting : config.options))
    return this.ps.formDialog(2, config, rec).then((frmResult: {response: string, value: {}}) => {
      if(frmResult && (frmResult.response == 'save')){
        return this.updateDoc(this.fixSubProperties(frmResult.value), `${path}/${rec['id']}`)//.catch(err => console.log(err))
      }
      if(frmResult && (frmResult.response == 'delete')){
        this.us.deleteUpload(rec['name'])
        return this.deleteDoc(`${path}/${rec['id']}`)//.catch(err => console.log(err))
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

  getSetting(code: string | string[]): Observable<string> {
    if(code && (typeof code == 'string') && (code.indexOf('SETTINGS:') != -1)){
      code = code.split(':')[1]
      if(code){
        return this.getUniqueValueId(this.gs.entityBasePath+'/settings', 'code', code).map((rec: Setting) => rec.setting)
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

  getUniqueValueId(collection: string, field: string, value: string) {
    if(value){
      if(field == 'id'){
        return this.db.doc(collection+'/'+value).snapshotChanges().map(rec => {
          return {id: value, ...rec.payload.data()}
        })
      } else {
        const lsPart = value.slice(0,value.length-1)
        const msPartASCII = value.charCodeAt(value.length-1)
        const startAt = lsPart+String.fromCharCode(msPartASCII-1)
        const endAt = lsPart+String.fromCharCode(msPartASCII+1)
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
