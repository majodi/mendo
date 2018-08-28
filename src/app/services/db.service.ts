
import {of as observableOf} from 'rxjs'

import {take, map} from 'rxjs/operators'
import { Injectable, ElementRef } from '@angular/core'

import { AngularFirestore, DocumentChangeAction } from 'angularfire2/firestore'
import * as firebase from 'firebase'
// import '@firebase/firestore'
// import { DocumentData, SetOptions } from '@firebase/firestore-types'
import { Observable } from 'rxjs/observable'

import { EntityMeta } from '../models/entity-meta.model'
import { AuthService } from './auth.service' ///// hoeft niet meer met gs = globalSettings service, later verbeteren
// import { PopupService } from './popup.service'; CAN NOT ADD - Circular refference!!
import { UploadService } from './upload.service'
import { GlobService } from './glob.service'
import { FieldConfig } from '../shared/dynamic-form/models/field-config.interface'
import { Setting } from '../entities/tenants/settings/setting.model'
import { QueryItem } from '../models/query-item.interface'
import { MatDialog } from '@angular/material'
import { PopupDialog } from '../shared/custom-components/components/popupdialog.component'

@Injectable()
export class DbService {

  constructor(
    private db: AngularFirestore,
    private as: AuthService,
    private us: UploadService,
    private gs: GlobService,
    private dialog: MatDialog,
  ) { }

  gmtToLocale(gmt?: string, format?: number): string {
    // gmt is a time (can be a zulu=gmt=iso formatted string or other) on the clock in Greenwich.
    // it will be converted to the time on the local clock at that moment
    // default gmt = now
    // 1 = yy-mm-dd hh:mm:ss ==> default
    // 2 = yy-mm-dd
    // 3 = hh:mm:ss
    const date = gmt === undefined ? new Date() : new Date(gmt)
    const isoDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()
    return  format === undefined || format === 1 ? isoDate.substr(0, 10) + ' ' + isoDate.substr(11, 8) :
            format === 2 ? isoDate.substr(0, 10) :
            format === 3 ? isoDate.substr(11, 8) :
            isoDate
  }

  getMeta(): EntityMeta {
    // const now = new Date()
    const now = this.gmtToLocale()
    const meta = {
      creator:  this.as.user.uid,
      // created:  now.toISOString(),
      created:  now,
      modifier: this.as.user.uid,
      // modified: now.toISOString()
      modified: now
    }
    return meta
  }

  getSetting(code: string | string[]): Observable<string> {
    if (code && (typeof code === 'string') && (code.indexOf('SETTINGS:') !== -1)) {
      code = code.split(':')[1]
      if (code) {
        return this.getUniqueValueId(this.gs.entityBasePath + '/settings', 'code', code).pipe(map((rec: Setting) => rec !== undefined && rec !== null ? rec.setting : ''))
      } else { return observableOf(null) }
    } else { return observableOf(null) }
  }

  addDoc(data, collection: string) {
    data.meta = this.getMeta()
    return this.db.collection(collection).add(data)
  }

  // setDoc(data, path: string, options?: SetOptions) {
  setDoc(data, path: string, options?: any) {
    if (options !== undefined) {return this.db.doc(path).set(data, options)} else {return this.db.doc(path).set(data)}
  }

  updateDoc(data, path: string) {
    const currentMeta = this.getMeta()
    return this.db.doc(path).update(data).then(() => {
      return this.db.doc(path).set({
        meta: {
          modifier: currentMeta.modifier,
          modified: currentMeta.modified
        },
      }, {merge: true})
    })
  }

  // don't use... possible hanger
  updateWithQuery(data, collection: string, queries?: QueryItem[]) {
    this.db.collection(collection, ref => {
      // let query : firebase.firestore.CollectionReference | firestore.firestore.Query = ref;
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref
      if (queries) {
        queries.forEach(q => {
          const qop: firebase.firestore.WhereFilterOp = q.operator === '<' ? '<' : q.operator === '<=' ? '<=' : q.operator === '==' ? '==' : q.operator === '>=' ? '>=' : q.operator === '>' ? '>' : '==' // '==' // q.operator
          if (q.value) { query = q.fld.indexOf('tag') < 0 ? query.where(q.fld, qop, q.value) : query.where(`${q.fld}.${Object.keys(q.value)[0]}`, '==', true)}
        })
      }
      return query
    })
    .snapshotChanges().pipe(
    map(actions => {
      return actions.map(a => {
        const pldata = a.payload.doc.data()
        const id = a.payload.doc.id
        return { id, ...pldata }
      })
    }))
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
      this.db.doc(path).snapshotChanges().pipe(take(1)).toPromise().then(data => {
        if (data.payload.exists) {resolve(data.payload.data())} else {reject('no such document!')}
      })
    })
  }

  buttonDialog(text, button1, button2?) {
    const dialogRef = this.dialog.open(PopupDialog, {
      width: '250px',
      data: { text: text, but1: button1, but2: button2 }
    })

    return dialogRef.afterClosed().toPromise().then(result => {
      return result
    })
  }

  syncEmailRecord(emailToCheck, formConfig, nameFld, tag) {
    if (!this.gs.emailRegex.test(String(emailToCheck).toLowerCase())) {
      this.buttonDialog('Email adres ongeldig!', 'OK')
      return
    }
    const currentName: string = formConfig.find(c => c.name === nameFld)['value']
    let prefix = '', lastName = '', firstName = ''
    if (currentName !== undefined && currentName !== null) {
      const nameArray = currentName.split(' ')
      firstName = nameArray[0]
      prefix = '', lastName = ''
      if (nameArray.length > 1) {lastName = nameArray[nameArray.length - 1]}
      if (nameArray.length > 2) {prefix = nameArray.slice(1, nameArray.length - 1).join(' ')}
      this.getDoc(`${this.gs.entityBasePath}/emailaddresses/${emailToCheck}`)
      .then(email => {
        const emailName = `${email['firstName']}${email['prefix'] ? ' ' + email['prefix'] + ' ' : ' '}${email['lastName']}`
        if (currentName !== undefined && currentName !== emailName) {
          this.buttonDialog(`${emailToCheck} gevonden in mailing-bestand met afwijkende naam: ${emailName} \r\n\r\nDeze naam als ontvanger behouden in mailing-bestand of aanpassen naar ${currentName}?`, 'behouden', 'aanpassen')
          .then(choice => {
            if (choice === 2) {
              let typetag = {}
              typetag[tag] = true
              if (email['typetag'] !== undefined) {typetag = Object.assign(typetag, email['typetag'])}
              this.updateDoc({firstName: firstName, prefix: prefix, lastName: lastName, typetag: typetag}, `${this.gs.entityBasePath}/emailaddresses/${emailToCheck}`)
            }
          })
        }
      })
      .catch(e => {
        if (currentName !== undefined) {
          this.setDoc({firstName: firstName, prefix: prefix, lastName: lastName, typetag: {medewerker: true}}, `${this.gs.entityBasePath}/emailaddresses/${emailToCheck}`)
        }
      })
    }
  }

  getOnOrder(collection: string, orderFld: string, orderDirection: string, value: string, asNumber: boolean, nr: number) {
    let startAt, direction
    if (orderDirection === 'desc') { direction = 'desc'} else { direction = 'asc'}
    if (asNumber) {
      startAt = Number(value)
    } else {
      const lsPart = value.slice(0, value.length - 1)
      const msPartASCII = value.charCodeAt(value.length - 1)
      startAt = lsPart + String.fromCharCode(msPartASCII - 1)
    }
    return this.db.collection(collection, ref => ref
    .limit(nr)
    .orderBy(orderFld, direction)
    .startAt(startAt)
    )
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id
          return { id, ...data }
        })
      }), take(1)
    )
  }

  getOnKeyOrder(collection: string, start: string, nr: number) {
    return this.db.collection(collection, ref => ref.where(firebase.firestore.FieldPath.documentId(), '>=', start).limit(nr))
    .snapshotChanges().pipe(
    map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id
        return { id, ...data }
      })
    }), take(1), )
  }

  getFirst(collection: string, queries: QueryItem[]) {
    return this.db.collection(collection, ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref
      if (queries) {
        queries.forEach(q => {
          const qop: firebase.firestore.WhereFilterOp = q.operator === '<' ? '<' : q.operator === '<=' ? '<=' : q.operator === '==' ? '==' : q.operator === '>=' ? '>=' : q.operator === '>' ? '>' : '==' // '==' // q.operator
          if (q.value) { query = q.fld.indexOf('tag') < 0 ? query.where(q.fld, qop, q.value) : query.where(`${q.fld}.${Object.keys(q.value)[0]}`, '==', true)}
        })
      }
      return query.limit(1)
    })
    .snapshotChanges().pipe(
    map(actions => {
      if (actions.length > 0) {
        const data = actions[0].payload.doc.data()
        const id = actions[0].payload.doc.id
        return { id, ...data }
      } else {return {}}
    }), take(1), )
  }

  getCount(collection: string, queries: QueryItem[]) {
    return this.db.collection(collection, ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref
      if (queries) {
        queries.forEach(q => {
          const qop: firebase.firestore.WhereFilterOp = q.operator === '<' ? '<' : q.operator === '<=' ? '<=' : q.operator === '==' ? '==' : q.operator === '>=' ? '>=' : q.operator === '>' ? '>' : '==' // '==' // q.operator
          if (q.value) { query = q.fld.indexOf('tag') < 0 ? query.where(q.fld, qop, q.value) : query.where(`${q.fld}.${Object.keys(q.value)[0]}`, '==', true)}
        })
      }
      return query
    })
    .snapshotChanges().pipe(
    map(children => {
      return children.length
    }))
  }

  getIncrementedCounter(counterName: string) {
    let new_count = 0
    const counterRef = firebase.firestore().doc(`${this.gs.entityBasePath}/settings/${counterName}`)
    return firebase.firestore().runTransaction(t => {
      return t.get(counterRef).then(doc => {
          if (doc.exists) {new_count = doc.data().count + 1}
          t.set(counterRef, { count: new_count })
      })
    }).then(v => new_count)
  }

  getUniqueValueId(collection: string, field: string, value: string, asNumber?: boolean) {
    if (value) {
      if (field === 'id') {
        return this.db.doc(collection + '/' + value).snapshotChanges().pipe(take(1), map(rec => {
          const data = rec.payload.data()
          this.convert(data)
          return { id: value, ...data }
          // return {id: value, ...rec.payload.data()}
        }))
      } else {
        let startAt, endAt
        if (asNumber !== undefined && asNumber === true) {
          startAt = Number(value)
          endAt = Number(value)
        } else {
          const lsPart = value.slice(0, value.length - 1)
          const msPartASCII = value.charCodeAt(value.length - 1)
          startAt = lsPart + String.fromCharCode(msPartASCII - 1)
          endAt = lsPart + String.fromCharCode(msPartASCII + 1)
        }
        return this.db.collection(collection, ref => ref
        .limit(2)
        .orderBy(field)
        .startAt(startAt).endAt(endAt))
        .snapshotChanges().pipe(take(1), map(recs => {
          if (recs.length === 1) {
            const data = recs[0].payload.doc.data()
            this.convert(data)
            const id = recs[0].payload.doc.id
            return { id, ...data }
          } else { return null}
        }))
      }
    } else { return observableOf(null) }
  }

  convert(o) {
    Object.keys(o).forEach((key) => {
      if (typeof o[key] === 'object') {
        if (o[key] !== null && o[key].hasOwnProperty('nanoseconds')) {
          o[key] = o[key].toDate()
        }
      }
    })
  }

}
