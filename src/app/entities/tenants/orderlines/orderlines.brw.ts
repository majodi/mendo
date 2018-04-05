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

@Component({
  selector: 'app-orderlines-brw',
  styles: [`
  .boxed {margin: 10px 10px; border: 3px solid #3f51b5; border-radius: 5px; width:65%; padding: 10px}
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
        <p class="mat-title">{{organisationRec?.address.name}}</p>
        <p class="mat-title">Totaal: {{total}}</p>
      </div>
    </div>
    <app-table
      [title]=title
      [titleIcon]=titleIcon
      [columnDefs]=columnDef
      [data]=orderLineData
      [isLoading]=isLoading
      [insertButton]="selectedOrder"
      [parentPrintHeaderRef]="printHeaderRef"
      (clicked)="clicked($event)"
    ></app-table>
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
          })
        }
        const colorsId = this.formConfig[this.formConfig.findIndex(c => c.name == 'colors')].value
        if(this.articleChanged || (colorsId && colorsId != this.currentColorsId)){
          this.currentColorsId = colorsId
          const colors = this.db.getUniqueValueId(`${this.gs.entityBasePath}/properties`, 'id', colorsId).subscribe((property: Property) => {
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
          })
        }
        this.articleChanged = false
      }
    }},
    {type: 'beforeSave', code: (action, o) => {
      if(action == 1){
        o['order'] = this.selectedOrder
        return Promise.resolve()
      } else return Promise.resolve()  
    }}
  ]
  orderLookup = {
    placeholder: 'Order',
    value: '0',
    customLookupFld: {path: 'orders', tbl: 'order', fld: 'number'},
    customLookupComponent: OrdersBrwComponent,
    customLookupItem: {id: '', display: 'number', subDisplay: 'date', addSearch: ''},
  }
  employeeRec: Employee
  organisationRec: Organisation
  selectedOrder: string
  @ViewChild('printheader') public printHeaderRef: ElementRef

  constructor(
    private orderLineSrv: OrderLineService,
    private cs: CrudService,
    private db: DbService,
    private gs: GlobService,
  ) {
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
          this.orderChoosen({id: orderQuery.value, employee: rec['employee'], organisation: rec['organisation']})  
        })
      }
    }
  }

  orderChoosen(e) {
    this.db.getDoc(`${this.gs.entityBasePath}/employees/${e['employee']}`).then(rec => {
      this.employeeRec = rec as Employee
    })
    this.db.getDoc(`${this.gs.entityBasePath}/organisations/${e['organisation']}`).then(rec => {
      this.organisationRec = rec as Organisation
    })
    this.selectedOrder = e['id']
    this.orderSelect.next(e['id'])
  }

  clicked(brwClick: {fld: string, rec: {}}) {
    let rec = brwClick.fld == 'insert' ? {} : brwClick.rec
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
