import { Injectable, ElementRef } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Rx';

import { EntityMeta } from '../models/entity-meta.model';
import { AuthService } from './auth.service'; ///// hoeft niet meer met gs = globalSettings service

@Injectable()
export class DbService {

  constructor(
    private db: AngularFirestore,
    private as: AuthService // haal hier net als project de tenant, deze zetten in auth, sleep wel auth overal mee.... dus maak global settings service to hold globals
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
