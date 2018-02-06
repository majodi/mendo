import { Injectable, ElementRef } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Rx';

import { AuthService } from './auth.service'; ///// hoeft niet meer met gs = globalSettings service

@Injectable()
export class DbService {

  constructor(
    private db: AngularFirestore,
    private as: AuthService // haal hier net als project de tenant, deze zetten in auth, sleep wel auth overal mee.... dus maak global settings service to hold globals
  ) { }

  initTestRecs$() {
    return this.db.collection<TestRec>('testrecs', ref => ref.where('meta.project','==','project'))
    .snapshotChanges()
    .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as TestRec
        const id = a.payload.doc.id
        return { id, ...data }
      })
    })
  }

  initMessages$() {
    return this.db.collection<Message>('messages', ref => ref.where('meta.project','==',this.as.project.id))
    .snapshotChanges()
    .map(messages => {
      return messages.map(a => {
        const data = a.payload.doc.data() as Message
        const id = a.payload.doc.id
        const recipientName = ''
        return { id, recipientName, ...data }
      })
    })
    .switchMap(messages => {
      let userDocObservables = messages.map((message: Message) => {
        if(message.recipient){
          return this.db.doc<User>('users/'+message.recipient).valueChanges().first()
        } else {
          return Observable.of(null)
        }
      })
      return userDocObservables.length === 0 ? Observable.of(messages) : Observable.combineLatest(...userDocObservables, (...userDocs) => {
        messages.forEach((message: Message, index) => {
          message.recipientName = userDocs[index] != null ? userDocs[index].displayName : ''
        })
        return messages
      })
    })    
  }  
  
  initUsers$() {
    return this.db.collection<User>('users', ref => ref.where('meta.project','==',this.as.project.id))
    .snapshotChanges()
    .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as User
        const uid = a.payload.doc.id
        return { uid, ...data }
      })
    })
  }

  initUploads$(tag?:string) {
    const query = (tag!=null && tag) ?
    this.db.collection<Upload>('uploads', ref => ref.where('meta.project','==',this.as.project.id).where('tagList.'+tag,'==',true)) :
    this.db.collection<Upload>('uploads', ref => ref.where('meta.project','==',this.as.project.id));
    return query
    .snapshotChanges()
    .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Upload
        const id = a.payload.doc.id
        return { id, ...data }
      })
    })
  }

  initPages$() {
    return this.db.collection<CmsPage>('cms_pages', ref => ref.where('meta.project','==',this.as.project.id))
    .snapshotChanges()
    .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as CmsPage
        const id = a.payload.doc.id
        return { id, ...data }
      })
    })
  }

  initCmsContainer$() {
    return this.db.collection<CmsContainer>(`${this.currentPage}/cms_containers`, ref => ref.orderBy("priority", "desc"))
    .snapshotChanges()
    .map(items => {
      return items.map(i => {
        const data = i.payload.doc.data()as CmsContainer
        const id = i.payload.doc.id
        const imageUrl = ''
        return { id, imageUrl, ...data }
      })
    })
  }

  initCmsItem$(container: CmsContainer) {
    return this.db.collection<CmsItem>(`${this.currentPage}/cms_containers/${container.id}/cms_items`, ref => ref.orderBy("priority", "desc"))
    .snapshotChanges()
    .map(items => {
      return items.map(i => {
        const data = i.payload.doc.data()as CmsItem
        const id = i.payload.doc.id
        const imageUrl = ''
        return { id, imageUrl, ...data }
      })
    })
    .switchMap(items => {
      let imageDocObservables = items.map((item: CmsItem) => {
        if(item.image){
          return this.db.doc<Upload>('uploads/'+item.image).valueChanges().first()
        } else {
          return Observable.of(null)
        }
      })
      return imageDocObservables.length === 0 ? Observable.of(items) : Observable.combineLatest(...imageDocObservables, (...imageDocs) => {
        items.forEach((item: CmsItem, index) => {
          item.imageUrl = imageDocs[index] != null ? imageDocs[index].url : ''
        })
        return items
      })
    })
  }  

  getRootPage() {
    return this.getDoc('cms_pages/'+this.as.project.id)
    .then((data: CmsPage) => {
      this.rootpageFound = true
      return data
    })
    .catch(err =>{
      this.rootpageFound = false
    })
  }

  createRootPage() {
    let cmsPage = {} as CmsPage
    this.initCmsPage(cmsPage)
    return this.setDoc(cmsPage, 'cms_pages/'+this.as.project.id).then(() => {
      return cmsPage
    }).catch(err => console.log('could not create root page', err))
  }

  getRootSettings() {
    return this.getDoc('cms_items/'+this.as.project.id)
    .then((data: CmsItem) => {
      return data
    })
    .catch(err => {
      let cmsItem = {} as CmsItem
      this.initCmsItem(cmsItem, true)
      return this.setDoc(cmsItem, 'cms_items/'+this.as.project.id).then(() => {
        return cmsItem
      }).catch(err => console.log('could not create default root container'))
    })
  }

  getMeta(): EntityMeta {
    let now = new Date()
    let meta = {
      project:  this.as.project.id,
      creator:  this.as.user.uid,
      created:  now.toISOString(),
      modifier: this.as.user.uid,
      modified: now.toISOString()
    }
    return meta    
  }

  initCmsPage(rec: CmsPage) {
    rec.meta = this.getMeta(), rec.title = this.as.project.name + ' (Home Page)'
  }

  initCmsContainer(rec: CmsContainer) {
    rec.meta = this.getMeta()
    rec.priority = 0
    rec.showTitle = true
    rec.centerTitle = false
    rec.fixedHeight = false
    rec.height = 25
    rec.evenHeight = true
    rec.minWidth = 25
    rec.maxWidth = 1024
    rec.bgColorItem = '#000000'
    rec.bgImageItem = ''
    rec.bgColorContainer = '#000000'
    rec.bgImageContainer = ''
    rec.textColor = '#000000'
    rec.opacity = 0.7
    rec.layout = 'Row'
    rec.wrap = true
    rec.alignH = 'space-around'
    rec.alignV = 'stretch'
}

  initCmsItem(rec: CmsItem, asContainer?: boolean) {
    rec.meta = this.getMeta(), rec.priority = 0, rec.title = 'Title', rec.content = '', rec.image = ''
    if(asContainer){
    }
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
