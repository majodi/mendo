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

@Component({
  selector: 'app-orderlines-brw',
  styles: [`
  .boxed {margin: 10px 10px; border: 3px solid #3f51b5; border-radius: 5px; width:25%; padding: 10px}
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
  formConfig = defaultFormConfig
  isLoading = false
  total = 0
  embeds: Embed[] = [
    {type: 'onValueChg', code: () => {
      let price_unit = this.formConfig[this.formConfig.findIndex(c => c.name == 'price_unit')].value
      let number = this.formConfig[this.formConfig.findIndex(c => c.name == 'number')].value
      if(price_unit && number){
        this.formConfig[this.formConfig.findIndex(c => c.name == 'amount')].value = (Number(price_unit) * Number(number)).toString()
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
        }
        this.isLoading = false  
      })
    }

  ngOnInit() {}

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
      this.isLoading = true
      this.cs.insertDialog(this.formConfig, rec, this.orderLineSrv.entityPath, this['embeds'] ? this['embeds'] : undefined).then(id => {this.isLoading = false}).catch(err => {this.isLoading = false; console.log(err)})
      return
    }
  }
  
  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()    
  }

}