
import {switchMap} from 'rxjs/operators'
import { Injectable, OnDestroy, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'

import * as firebase from 'firebase/app'

import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore'

import { Observable, Subject } from 'rxjs'

import { User } from '../models/user.model'
import { EntityMeta } from '../models/entity-meta.model'
import { fullNavList } from '../modules/navlist'

import { GlobService } from './glob.service'

@Injectable()
export class AuthService {
  user$: Observable<User>
  user: User = new Object() as any
  userLevel = 0
  isLoggedIn = false // anonymous or as real user
  redirectUrl = ''
  tenantQP = null
  tenantId = ''
  tenantName = 'Mendo'
  tenantModules = ['app']
  authReady$ = new Subject()
  host = ''
  navList = []

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private gs: GlobService,
    private http: HttpClient
  ) {
    this.host = document.domain
    this.http.get('assets/tenant.json').subscribe(tenants => {
      const hostTenant = tenants['hosts'].find(o => (o.host === this.host) && !o.multi_tenant)
      const tenantId = this.tenantQP != null ? this.tenantQP : hostTenant !== undefined ? hostTenant['tenantId'] : tenants['defaultId']
      const registeredTenant = tenants['tenants'].find(o => o.id === tenantId)
      if (registeredTenant !== undefined && registeredTenant.id !== undefined) {
        this.tenantId = registeredTenant.id
        this.gs.tenantId = registeredTenant.id
        this.gs.entityBasePath = 'tenants/' + registeredTenant.id
        this.gs.tenantName = registeredTenant.name
        this.tenantName = registeredTenant.name
        this.tenantModules = this.tenantModules.concat(registeredTenant.modules)
      }
    }) // als geen tenant json dan terugvallen op default in Glob (mendo tenant)
    this.user$ = this.afAuth.authState.pipe(
    switchMap(fb_user => {
      console.log('authstate change ', fb_user, this.gs.tenantId)
      if (fb_user) {
          return this.updateUserData(fb_user).then(x => {
            return this.getDoc(`users/${fb_user.uid}`).then((user: User) => {
              this.user = user
              this.gs.activeUser = user
              this.userLevel = user.level !== undefined ? user.level : 0
              this.isLoggedIn = true
              this.setNavList()
              this.authReady$.next()
              console.log('auth ready for: ', this.gs.tenantId, this.userLevel)
              return user
            })
          }).catch(err => {console.log('Auth error get/set userdata: ', err); return null})
      } else {
        return this.afAuth.auth.signInAnonymously().then(credential => null)
      }
    }))
    this.user$.subscribe()
  }

  setNavList() {this.navList = fullNavList.filter(item => (this.tenantModules.includes(item.module) && this.userLevel >= item.level))}

  changeProfile(name, photo) {
    const user = firebase.auth().currentUser
    return user.updateProfile({
      displayName: name,
      photoURL: photo
    })
  }

  createPaymentTransaction(reference: string, amount: string) {
    return this.http.get(`https://us-central1-mendo-app.cloudfunctions.net/mollieCreatePayment?creator=${this.user.uid}&tenant=${this.tenantId}&reference=${reference}&amount=${amount}`, { responseType: 'text', observe: 'response' })
  }

  createAndLinkAccount(employeeId: string) {
    return this.http.get(`https://us-central1-mendo-app.cloudfunctions.net/createAndLinkAccount?creator=${this.user.uid}&tenant=${this.tenantId}&code=${employeeId}`, { responseType: 'text', observe: 'response' })
    // return this.http.get(`http://localhost:4200/api/createAndLinkAccount?creator=${this.user.uid}&tenant=${this.tenantId}&code=${employeeId}`, { responseType: 'text', observe: 'response' })
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
      return this.updateUserData({uid: credential.uid, email: '', photoURL: './assets/noavatar.svg', isAnonymous: true})
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
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.oAuthLogin(provider)
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
        if (snap.payload.exists) {
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
    const now = new Date()
    const noAvatar = user.isAnonymous ? './assets/noavatar.svg' : './assets/blancavatar.svg'
    const noName = user.isAnonymous ? 'Anoniem' : 'Alleen Email bekend'
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`)
    return this.getDoc(`users/${user.uid}`).then((existingUser: User) => {
      const data = {
        meta: {modifier: user.uid, modified: now},
        email: user.email || '',
        photoURL: user.photoURL || noAvatar,
        verified: user.emailVerified !== undefined ? user.emailVerified : false,
        displayName: user.displayName || noName,
        isAnonymous: user.isAnonymous !== undefined ? user.isAnonymous : true,
        providerLogin: user.providerData[0] !== undefined && user.providerData[0]['providerId'] !== 'password' ? true : false,
      }
      return userRef.set(data, { merge: true })
    }).catch(err => {
      const data = {
        uid: user.uid,
        meta: {creator: user.uid, created: now, modifier: user.uid, modified: now},
        email: user.email || '',
        photoURL: user.photoURL || noAvatar,
        verified: user.emailVerified !== undefined ? user.emailVerified : false,
        displayName: user.displayName || noName,
        isAnonymous: user.isAnonymous !== undefined ? user.isAnonymous : true,
        providerLogin: user.providerData[0] !== undefined && user.providerData[0]['providerId'] !== 'password' ? true : false,
        level: 0,
        tenant: this.gs.tenantId
      }
      return userRef.set(data, { merge: true })
    })
  }

  setSubscription(subscription: PushSubscription) {
    if (subscription !== undefined) {
      return this.getDoc(`users/${this.user.uid}`).then((user: User) => {
        const parsedSubscription = JSON.parse(JSON.stringify(subscription)) // anders foutmelding
        if (user.pushSubscriptions === undefined) { user.pushSubscriptions = [] }
        if (user.pushSubscriptions.find(subs => subs.endpoint === subscription.endpoint) === undefined) {
          user.pushSubscriptions.push(parsedSubscription)
          return this.afs.doc(`users/${this.user.uid}`).update({pushSubscriptions: user.pushSubscriptions})
        }
      })
    }
  }
}
