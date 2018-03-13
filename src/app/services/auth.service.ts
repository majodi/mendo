import { Injectable, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable, Subject } from 'rxjs';

import { User } from '../models/user.model';
import { EntityMeta } from '../models/entity-meta.model';

/////////////// set tenant id in glob!!

@Injectable()
export class AuthService {
  user$: Observable<User>
  user: User = new Object() as any
  authReady$ = new Subject()
  host = ''

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.host = document.domain
    this.user$ = this.afAuth.authState
    .switchMap(fb_user => {
      console.log('authstate change ', fb_user)
      if (fb_user) {
          return this.updateUserData(fb_user).then(x => {
            return this.getDoc(`users/${fb_user.uid}`).then((user: User) => {
              this.user = user;
              this.authReady$.next();
              return user
            })
          }).catch(err => {console.log('Auth error get/set userdata: ', err); return null})  
      } else {
        return this.afAuth.auth.signInAnonymously().then(credential => {return null})
      }
    })
    this.user$.subscribe()
  }

  sendVerification() {
    return this.afAuth.auth.currentUser.sendEmailVerification().then(() => console.log('verification mail sent'))
  }

  sendPasswordReset() {
    return this.afAuth.auth.sendPasswordResetEmail(this.afAuth.auth.currentUser.email).then(() => console.log('password reset mail sent'))
  }

  sendUpdateEmail(email) {
    return this.afAuth.auth.currentUser.updateEmail(email).then(() => console.log('update email + mail sent to old'))
  }

  anonymousLogin() {
    console.log('ANONYMOUS SIGN-IN')
    return this.afAuth.auth.signInAnonymously()
    .then(credential => {
      return this.updateUserData({uid: credential.uid, email: '', photoURL: './assets/noavatar.png', isAnonymous: true})
    })
  }

  passwordSignup(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(user => {
      return this.updateUserData(user).then(() => {this.sendVerification()})
    })
  }

  passwordLogin(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password).then(user => {
      return this.updateUserData(user)
    })
  }

  googleLogin() {
    let provider = new firebase.auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }

  oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user)
      })
  }

  signOut() {
    this.afAuth.auth.signOut()
  }
  
  getDoc(path) {
    return new Promise((resolve, reject) => {
      this.afs.doc(path).snapshotChanges().subscribe(snap => {
        if(snap.payload.exists){
          const id = snap.payload.id
          const data = snap.payload.data()
          const rec = {id, ...data}
          resolve(rec)
        } else {
          reject('no such document in Auth getdoc')
        }
      })
    })
  }
  
  updateUserData(user) {
    let now = new Date()
    let userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    return this.getDoc(`users/${user.uid}`).then((existingUser: User) => {
      let data = {
        meta: {modifier: user.uid, modified: now},
        email: user.email || '',
        photoURL: user.photoURL || './assets/noavatar.svg',
        verified: user.emailVerified != undefined ? user.emailVerified : false,
        displayName: user.displayName || 'Anonymous',
        isAnonymous: user.isAnonymous != undefined ? user.isAnonymous : true,
      }
      return userRef.set(data, { merge: true })
    }).catch(err => {
      let data = {
        uid: user.uid,
        meta: {creator: user.uid, created: now, modifier: user.uid, modified: now},
        email: user.email || '',
        photoURL: user.photoURL || './assets/noavatar.svg',
        verified: user.emailVerified != undefined ? user.emailVerified : false,
        displayName: user.displayName || 'Anonymous',
        isAnonymous: user.isAnonymous != undefined ? user.isAnonymous : true,
        level: 0
      }
      return userRef.set(data, { merge: true })
    })
  }
  
}
