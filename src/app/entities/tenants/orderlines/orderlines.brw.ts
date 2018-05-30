import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';

import { OrderLine, defaultColDef, defaultFormConfig, defaultTitle, defaultTitleIcon } from './orderline.model';
import { OrderLineService } from './orderline.service';
import { CrudService } from '../../../services/crud.service';
import { DbService } from '../../../services/db.service';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { QueryItem } from '../../../models/query-item.interface';
import { Embed } from '../../../shared/dynamic-form/models/embed.interface';
import { FieldConfig } from '../../../shared/dynamic-form/models/field-config.interface';
import { OrdersBrwComponent } from '../orders/orders.brw';
import { Organisation } from '../organisations/organisation.model';
import { Employee } from '../organisations/employees/employee.model';
import { GlobService } from '../../../services/glob.service';
import { Property } from '../properties/property.model';
import { Image } from '../images/image.model';
import { PopupService } from '../../../services/popup.service';
import { MessageService } from '../messages/message.service';
import { Article } from '../articles/article.model';

@Component({
  selector: 'app-orderlines-brw',
  styles: [`
  .boxed {margin: 10px 10px; border: 3px solid #3f51b5; border-radius: 5px; width:80%; padding: 10px}
  `],
  template: `
  <div style="width:100%">
    <div fxLayout="row" fxLayoutAlign="space-around start" >
      <div fxFlex class="boxed">
        <app-lookup
          ngDefaultControl
          [lookupComponent]="orderLookup.customLookupComponent"
          [lookupPlaceholder]="orderLookup.placeholder"
          [collectionPath]="orderLookup.customLookupFld.path"
          [collectionFld]="orderLookup.customLookupFld.fld"
          [lookupItemDef]="orderLookup.customLookupItem"
          [value]="orderLookup.value"
          [numeric]="true"
          (itemChosen)="orderChoosen($event)"
        ></app-lookup>
      </div>
      <div #printheader fxFlex fxFlexAlign="end" class="boxed">
        <p class="mat-title">{{employeeRec?.address.name}}</p>
        <p class="mat-title">{{organisationRec?.address.name}} {{employeeRec?.branch}}</p>
        <p class="mat-body-2">Budget medewerker      : {{employeeRec?.budget}}</p>
        <p class="mat-body-2">Totaal deze bestelling : {{total}}</p>
        <p class="mat-body-2">Restant na bestelling  : {{employeeRec?.budget - total}}</p>
      </div>
    </div>
    <app-table
      [title]=title
      [titleIcon]=titleIcon
      [columnDefs]=columnDef
      [data]=orderLineData
      [isLoading]=isLoading
      [insertButton]="selectedOrder && !statusNr"
      [parentPrintHeaderRef]="printHeaderRef"
      (clicked)="clicked($event)"
    ></app-table>
    <div class="boxed">
      <p class="mat-title" (click)="showOrderHistory()">
      <span>
        Huidige Status:
        <span style="color: blue">
          <mat-icon style="vertical-align: sub; margin-right: 4px">
            {{getStatusIcon()}}
          </mat-icon>
          {{getStatusText()}}
        </span>
      </span>
      </p>
      <button *ngIf="getNextStatusButtonText()" mat-raised-button (click)="promoteStatus()"><mat-icon style="margin-right: 4px; color: green">{{getNextStatusButtonIcon()}}</mat-icon><span>{{getNextStatusButtonText()}}</span></button>
      <button *ngIf="currentLevel >= 50 || statusNr < 3" mat-raised-button (click)="cancelOrder()"><mat-icon style="margin-right: 4px; color: red">cancel</mat-icon>Annuleer Order</button>
    </div>
  </div>
  `,
})
export class OrderLinesBrwComponent implements OnInit, OnDestroy {
  orderLineData: OrderLine[]
  ngUnsubscribe = new Subject<string>()
  orderSelect = new BehaviorSubject<string|null>(null)
  title = defaultTitle
  titleIcon = defaultTitleIcon
  columnDef = defaultColDef
  formConfig: FieldConfig[] = defaultFormConfig
  isLoading = false
  total = 0
  currentArticleId = ''
  articleChanged = false
  currentImageId = ''
  currentSizesId = ''
  currentColorsId = ''
  embeds: Embed[] = [
    {type: 'onValueChg', code: (ctrl, value) => {
      const price_unit = this.formConfig[this.formConfig.findIndex(c => c.name == 'price_unit')].value
      const number = this.formConfig[this.formConfig.findIndex(c => c.name == 'number')].value
      if(price_unit && number){
        this.formConfig[this.formConfig.findIndex(c => c.name == 'amount')].value = (Number(price_unit) * Number(number)).toString()
      }
      if(ctrl == 'article'){
        const articleId = this.formConfig[this.formConfig.findIndex(c => c.name == 'article')].value
        if(articleId != this.currentArticleId) {this.articleChanged = true; this.currentArticleId = articleId}
        const imageId = this.formConfig[this.formConfig.findIndex(c => c.name == 'imageid')].value
        if(imageId && imageId != this.currentImageId){
          this.currentImageId = imageId
          const image = this.db.getUniqueValueId(`${this.gs.entityBasePath}/images`, 'id', imageId).subscribe((image: Image) => {
            return this.formConfig[this.formConfig.findIndex(c => c.name == 'imagedisplay')].value = image['name']
          })
        }
        const sizesId = this.formConfig[this.formConfig.findIndex(c => c.name == 'sizes')].value
        if(this.articleChanged || (sizesId && sizesId != this.currentSizesId)) {
          this.currentSizesId = sizesId
          const sizes = this.db.getUniqueValueId(`${this.gs.entityBasePath}/properties`, 'id', sizesId).subscribe((property: Property) => {
            if(property){
              const defaultSizesChoices = property['choices'].split(',')
              const overruleSizes = this.formConfig[this.formConfig.findIndex(c => c.name == 'overruleSizes')].value
              if(overruleSizes){
                const overruleSizesChoices = this.formConfig[this.formConfig.findIndex(c => c.name == 'overruleSizesChoices')].value
                let overruleSizesChoicesArray: Array<string> = []
                for (var key in overruleSizesChoices){
                  if(defaultSizesChoices.includes(key)){overruleSizesChoicesArray.push(key)}
                }                  
                return this.formConfig[this.formConfig.findIndex(c => c.name == 'size')].options = overruleSizesChoicesArray
              }
              return this.formConfig[this.formConfig.findIndex(c => c.name == 'size')].options = defaultSizesChoices  
            }
          })
        }
        const colorsId = this.formConfig[this.formConfig.findIndex(c => c.name == 'colors')].value
        if(this.articleChanged || (colorsId && colorsId != this.currentColorsId)){
          this.currentColorsId = colorsId
          const colors = this.db.getUniqueValueId(`${this.gs.entityBasePath}/properties`, 'id', colorsId).subscribe((property: Property) => {
            if(property){
              const defaultColorsChoices = property['choices'].split(',')
              const overruleColors = this.formConfig[this.formConfig.findIndex(c => c.name == 'overruleColors')].value
              if(overruleColors){
                const overruleColorsChoices = this.formConfig[this.formConfig.findIndex(c => c.name == 'overruleColorsChoices')].value
                let overruleColorsChoicesArray: Array<string> = []
                for (var key in overruleColorsChoices){
                  if(defaultColorsChoices.includes(key)){overruleColorsChoicesArray.push(key)}
                }                  
                return this.formConfig[this.formConfig.findIndex(c => c.name == 'color')].options = overruleColorsChoicesArray
              }
              return this.formConfig[this.formConfig.findIndex(c => c.name == 'color')].options = defaultColorsChoices  
            }
          })
        }
        this.articleChanged = false
      }
    }},
    {type: 'beforeSave', code: (action, o) => {
      return this.db.getDoc(`${this.gs.entityBasePath}/articles/${o['article']}`)
      .then((article: Article) => {
        return this.db.getDoc(`${this.gs.entityBasePath}/images/${article.image}`)
        .then((image: Image) => {
          o['thumbNameOnSave'] = image.thumbName
          o['amount'] = o['number'] * o['price_unit'] //last update for if user pressed enter
          if(action == 1){
            o['order'] = this.selectedOrder
            for (var key in o){
              if(o[key] == undefined) {
                o[key] = null
              }
            }                
          }
          return
        })
        .catch(e => {
          console.log('getting article-image before save orderline: ', e)          
        })
      })
      .catch(e => {
        console.log('getting article before save orderline: ', e)
      })
    }}
  ]
  orderLookup = {
    placeholder: 'Order',
    value: '0',
    customLookupFld: {path: 'orders', tbl: 'order', fld: 'number'},
    customLookupComponent: OrdersBrwComponent,
    customLookupItem: {id: '', display: 'number', subDisplay: 'date', addSearch: '', subDisplayFunction: (orderDate: Date) => `${orderDate.toISOString().substr(0,10)}   (${orderDate.toISOString().substr(11,5)})`},
  }
  employeeRec: Employee
  organisationRec: Organisation
  selectedOrder: string
  orderStatus: string
  statusNr: number
  orderHistory: string
  orderNumber: number
  currentLevel: number = 0
  
  @ViewChild('printheader') public printHeaderRef: ElementRef

  constructor(
    private orderLineSrv: OrderLineService,
    private cs: CrudService,
    private db: DbService,
    private gs: GlobService,
    private ps: PopupService,
    private messageSrv: MessageService,
  ) {
      this.formConfig = defaultFormConfig.map(x => Object.assign({}, x));
      this.orderLineSrv.colDef = this.columnDef
      this.orderLineSrv.formConfig = this.formConfig
      this.orderSelect.switchMap(id => {
        this.isLoading = true
        if(id){
          return this.orderLineSrv.initEntity$([{fld: 'order', operator: '==', value: id}])
        } else {
          return Observable.of(null)
          // return this.orderLineSrv.initEntity$()
        }
      }).takeUntil(this.ngUnsubscribe).subscribe(orderlines => {
        if(orderlines != null){
          this.orderLineData = orderlines
          this.total = orderlines.reduce((a, b) => a + Number(b['amount']), 0)
          this.db.updateDoc({total: this.total}, `${this.gs.entityBasePath}/orders/${this.selectedOrder}`)
        }
        this.isLoading = false  
      })
    }

  ngOnInit() {
    if(this.gs.NavQueries && this.gs.NavQueries.length > 0 && !this.gs.NavQueriesRead){
      this.gs.NavQueriesRead = true
      const orderQuery = this.gs.NavQueries.find(nq => nq.fld == 'order' && nq.operator == '==')
      if(orderQuery != undefined){
        this.orderLookup.value = ''+orderQuery.value
        this.db.getDoc(`${this.gs.entityBasePath}/orders/${orderQuery.value}`).then(rec => {
          this.orderChoosen({id: orderQuery.value, employee: rec['employee'], organisation: rec['organisation'], status: rec['status'], history: rec['history'], number: rec['number']})  
        })
      }
    }
  }


  promoteStatus() {
    let newStatus = ''
    if(this.orderStatus == 'closed'){newStatus = 'approved'}
    if(this.orderStatus == 'approved'){newStatus = 'processed'}
    if(this.orderStatus == 'processed'){newStatus = 'delivered'}
    const setData = {status: newStatus, history: this.setNewHistory(newStatus)}
    this.db.setDoc(setData, `${this.gs.entityBasePath}/orders/${this.selectedOrder}`, {merge: true})
    .then(() => {
      this.setCurrentStatus(setData['status'])
      if(setData['status'] == 'approved'){
        //send mail naar tenant
        this.messageSrv.sendSystemMail('tenant', undefined, `Nieuwe goedkeuring (order ${this.orderNumber})`, `
Beste ${this.gs.tenantName},

Order ${this.orderNumber} voor ${this.organisationRec.address.name} is goedgekeurd. Het totaalbedrag bedraagt: ${this.total} ${this.organisationRec.currency}.

Met vriendelijke groet,

Mendo
        `, undefined, undefined, this.selectedOrder)
        // .then(() => {this.ps.buttonDialog('Mail verstuurd naar: '+email, 'OK')})
        // .catch(err => {this.ps.buttonDialog('Fout bij versturen:'+err, 'OK')})
      }
    })
  }

  getStatusText() {
    const statusTexts = ['Nieuw', 'Afgesloten', 'Goedgekeurd', 'Verwerkt', 'Geleverd', 'Geannuleerd']
    return(statusTexts[this.statusNr])
  }

  getStatusIcon() {
    const statusIcons = ['fiber_new', 'lock_outline', 'thumb_up', 'done', 'done_all', 'cancel']
    return(statusIcons[this.statusNr])
  }

  getNextStatusButtonText() {
    if(this.statusNr > 1 && this.gs.activeUser.level < 50){return ''}
    const nextStatusButtonTexts = ['', 'Goedkeuren', 'Verwerkt', 'Geleverd', '', '']
    return nextStatusButtonTexts[this.statusNr]
  }

  getNextStatusButtonIcon() {
    const nextStatusButtonIcons = ['', 'thumb_up', 'done', 'done_all', '', '']
    return nextStatusButtonIcons[this.statusNr]
  }

  cancelOrder() {
    if(this.statusNr > 2 && this.gs.activeUser.level < 50){return ''}
    const field = {value: '', placeholder: 'Rede voor annuleren', label: 'Rede:'}
    this.ps.buttonDialog('Order annuleren? Orderregels worden verwijderd!', 'NIET Annuleren', 'JA, Annuleer', field).then(b => {
      if(b == 2){
        if(!field.value){this.ps.buttonDialog('Geen rede opgegeven, Order werd NIET geannuleerd', 'OK'); return}
        this.orderLineData.forEach(ol => {
          this.db.deleteDoc(`${this.gs.entityBasePath}/orderlines/${ol.id}`)
        })
        const setData = {status: 'cancelled', total: 0, line_count: 0, history: this.setNewHistory('Geannuleerd', field.value)}
        this.db.setDoc(setData, `${this.gs.entityBasePath}/orders/${this.selectedOrder}`, {merge: true}).then(() => this.setCurrentStatus('cancelled'))
      }
    })
  }

  setNewHistory(change, reason?) {
    const now = new Date()
    const newHistory = `${this.orderHistory ? this.orderHistory : ''}\r\n** ${change} - ${now} - Door: ${this.gs.activeUser.uid}${reason ? ' - Rede: '+reason : ''}`
    this.orderHistory = newHistory
    return newHistory
  }

  showOrderHistory() {
    this.ps.buttonDialog('Orderhistorie:\r\n\r\n' + this.orderHistory, 'OK')
  }

  orderChoosen(e) {
    // console.log('e: ', e)
    if(this.gs.activeUser.level <= 25 && e['organisation'] != this.gs.activeUser.organisation) {this.orderSelect.next('0') ;return};
    this.db.getDoc(`${this.gs.entityBasePath}/employees/${e['employee']}`).then(rec => {
      this.employeeRec = rec as Employee
    })
    this.db.getDoc(`${this.gs.entityBasePath}/organisations/${e['organisation']}`).then(rec => {
      this.organisationRec = rec as Organisation
    })
    this.selectedOrder = e['id']
    this.orderHistory = e['history']
    this.orderNumber = e['number']
    this.setCurrentStatus(e['status'])
    this.orderSelect.next(e['id'])
  }

  setCurrentStatus(orderStatus) {
    this.orderStatus = orderStatus
    this.statusNr = ['new', 'closed', 'approved', 'processed', 'delivered', 'cancelled'].findIndex(s => s == this.orderStatus)
    this.currentLevel = this.gs.activeUser.level //needed in HTML but gs is private, so not direct usable
  }

  clicked(brwClick: {fld: string, rec: {}}) {
    if(this.statusNr > 0){
      this.ps.buttonDialog('Order reeds afgesloten.', 'OK')
      return
    }
    let rec = brwClick.fld == 'insert' ? {} : brwClick.rec
    const pricefld = this.formConfig.find(c => c.name == 'price_unit')
    if(pricefld) pricefld.label = `Prijs${this.organisationRec ? ' (' + this.organisationRec['currency'] + ')' : ''}`
    if(!['insert','selection'].includes(brwClick.fld)){
      this.cs.changeDeleteDialog(this.formConfig, rec, this.orderLineSrv.entityPath, brwClick.fld, this['embeds'] ? this['embeds'] : undefined).catch(err => console.log(err))
      return
    }    
    if(brwClick.fld == 'insert'){
      this.formConfig.map(fld => fld.value = '')
      // this.isLoading = true
      this.cs.insertDialog(this.formConfig, rec, this.orderLineSrv.entityPath, this['embeds'] ? this['embeds'] : undefined).then(id => {this.isLoading = false}).catch(err => {this.isLoading = false; console.log(err)})
      return
    }
  }
  
  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()    
  }

}
