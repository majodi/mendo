import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { FieldConfig } from './shared/dynamic-form/models/field-config.interface';
import { Tile } from './shared/custom-components/models/tile.model';
import { BulletinService } from './entities/tenants/bulletins/bulletin.service';
import { DbService } from './services/db.service';
import { GlobService } from './services/glob.service';
import { FormFieldService } from './entities/tenants/forms/formfields/formfield.service';
import { Validators } from '@angular/forms';
import { forceUppercase, forceCapitalize } from './shared/dynamic-form/models/form-functions';
import { CrudService } from './services/crud.service';
import { Embed } from './shared/dynamic-form/models/embed.interface';
import { AuthService } from './services/auth.service';
import { SwPush } from '@angular/service-worker';
import { environment } from '../environments/environment';
import * as firebase from 'firebase';

@Component({
  selector: 'app-home',
  styles: [``],
  template: `
  <div style="width:100%">
  <app-grid
    [singleRow]="false"
    [buttonIcon]="'open_in_browser'"
    [maxItemWidth]="'97'"
    [maxImageHeight]="'100'"
    [data]="bulletinData"
    [divider]="true"
    (buttonClicked)="onButtonClicked($event)"
  ></app-grid>
  </div>
  `,
})
export class HomePageComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<string>()
  bulletinData: Tile[]
  formId: string
  embeds: Embed[] = [
    {type: 'beforeSave', code: (action, o) => {
      if(action == 1){
        o['form'] = this.formId
        return Promise.resolve()
      } else return Promise.resolve()  
    }}
  ]

  constructor(
    private BulletinSrv: BulletinService,
    private router: Router,
    private db: DbService,
    private gs: GlobService,
    private cs: CrudService,
    public _as: AuthService,
    private swPush: SwPush,
    private formFieldSrv: FormFieldService,
  ) {
    this.BulletinSrv.colDef = [{name: 'image_v'}]
    this.BulletinSrv.formConfig = [{type: 'lookup', name: 'image', customLookupFld: {path: 'images', tbl: 'image', fld: 'name'}},]
    this.BulletinSrv.initEntity$().takeUntil(this.ngUnsubscribe).subscribe(bulletins => {
      return this.bulletinData = bulletins.map(bulletin => {
        return {
          id: bulletin.id,
          date: bulletin.date,
          sticky: bulletin.sticky == null ? false : bulletin.sticky,
          title: bulletin.title,
          image: bulletin.image_v,
          description: bulletin.text,
          buttonText: bulletin.buttonText,
          buttonLink: bulletin.buttonLink
        }  
      }).sort(function(a,b) {return (a['date'] > b['date'] || a['sticky']) ? -1 : ((b['date'] > a['date'] || b['sticky']) ? 1 : 0);})
    })
  }

  ngOnInit() {}

  pushSubscribeFB() {
    navigator.serviceWorker.getRegistration().then(swreg => {
      console.log('swreg with getregistration: ', swreg)
      if(swreg){
        firebase.messaging().useServiceWorker(swreg)
        firebase.messaging().requestPermission().then(function() {
          console.log('Notification permission granted.');
          firebase.messaging().getToken().then(function(currentToken) {
            if (currentToken) {
              console.log('token: ', currentToken)
              // sendTokenToServer(currentToken);
              // updateUIForPushEnabled(currentToken);
            } else {
              // Show permission request.
              console.log('No Instance ID token available. Request permission to generate one.');
              // Show permission UI.
              // updateUIForPushPermissionRequired();
              // setTokenSentToServer(false);
            }
          }).catch(function(err) {
            console.log('An error occurred while retrieving token. ', err);
            // showToken('Error retrieving Instance ID token. ', err);
            // setTokenSentToServer(false);
          });
        }).catch(function(err) {
          console.log('Unable to get permission to notify.', err);
        });
      }
    }).catch(err => console.log('could not get SW: ', err))
  }

  pushSubscribe() {
    return this.swPush.requestSubscription({
      serverPublicKey: environment.vapidPublic
    })
    .then((pushSubscription: PushSubscription) => {
      return this._as.setSubscription(pushSubscription) //.then(v => {console.log('pushSubscription written: ', pushSubscription, v)})
    })
    .catch(e => {console.log('error request subscription: ', e)})
  }

  onButtonClicked(e) {
    const link: string = e['buttonLink']
    if(link.toUpperCase().startsWith('HTTP')){this.pushSubscribe(); window.open(link); return}
    if(link.toUpperCase().startsWith('FORM:')){this.openUserForm(link.toUpperCase().split(':')[1]); return} // subscribe on form save (below)
    this.pushSubscribe()
    this.router.navigate([e['buttonLink']])
  }

  openUserForm(formCode) {
    this.db.getFirst(`${this.gs.entityBasePath}/forms`, [{fld: 'code', operator: '==', value: formCode}]).subscribe(form => {
      this.formId = form['id']
      const formConfig = []
      this.formFieldSrv.initEntity$([{fld: 'form', operator: '==', value: form['id']}])
      .map(flds => flds.sort(function(a,b) {return (a['order'] > b['order']) ? 1 : ((b['order'] > a['order']) ? -1 : 0);}))
      .subscribe(flds => {flds.forEach(fld => {
          const fieldType = ['input', 'select', 'checkbox', 'stringdisplay', 'imagedisplay'][['invoer', 'keuze', 'vink', 'tekst', 'afbeelding'].findIndex(t => t == fld['type'])]
          let validation = []
          if(fld['required']){validation.push(Validators.required)}
          if(!isNaN(fld['minLength'])){validation.push(Validators.minLength(+fld['minLength']))}
          let transform = [undefined, forceUppercase, forceCapitalize][['geen', 'hoofdletters', 'woord-hoofdletter'].findIndex(t => t == fld['transform'])]
          if(fieldType == 'imagedisplay'){
            this.db.getUniqueValueId(`${this.gs.entityBasePath}/images`, 'id', fld['image']).subscribe(rec => {
              if(rec){
                //async dus op dat moment naar juiste index zoeken:
                formConfig[formConfig.findIndex(c => c.name == fld['name'])].value = rec.name
              }
            })          
          }
          const optionsStr: string = fld['options']; const options = optionsStr ? optionsStr.split(',') : []
          formConfig.push({type: fieldType, label: fld['label'], name: fld['name'], placeholder: fld['label'], value: fld['value'], options: options, validation: validation, inputValueTransform: transform})
        })
        this.cs.insertDialog(formConfig, {}, `${this.gs.entityBasePath}/formresults`, this['embeds'] ? this['embeds'] : undefined, 'Invulformulier').then(id => {this.pushSubscribe()}).catch(err => {console.log(err)})
      })
    })
  }

  ngOnDestroy() {
    // console.log('push subscribe on destroy')
    this.pushSubscribe().then(v => {
      this.ngUnsubscribe.next()
      this.ngUnsubscribe.complete()
    })
  }

}

// <div *ngIf="_as.userLevel==100">
// <button (click)="pushSubscribe()">subscribe</button>
// <button (click)="pushSubscribeFB()">subscribe FB</button>
// </div>
