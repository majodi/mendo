import { Component, OnInit, OnDestroy } from '@angular/core';

import { OrderLine, defaultColDef, defaultFormConfig, defaultTitle, defaultTitleIcon } from './orderline.model';
import { OrderLineService } from './orderline.service';
import { CrudService } from '../../../services/crud.service';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { QueryItem } from '../../../shared/custom-components/baseclasses/query-item.interface';
import { Embed } from '../../../shared/dynamic-form/models/embed.interface';

@Component({
  selector: 'app-orderlines-brw',
  template: `
  <div style="width:100%">
    <app-table
      [title]=title
      [titleIcon]=titleIcon
      [columnDefs]=columnDef
      [data]=orderLineData
      [isLoading]=isLoading
      (clicked)="clicked($event)"
    ></app-table>
  </div>
  `,
  styles: [``]
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
  embeds: Embed[] = [
    {type: 'onValueChg', code: (data) => {
      console.log('val chg embed data: ', data) // hier code voor updaten amount
    }}
  ]

  constructor(
    private orderLineSrv: OrderLineService,
    private cs: CrudService,
  ) {
    this.orderLineSrv.colDef = this.columnDef
    this.orderLineSrv.formConfig = this.formConfig
    this.orderSelect.switchMap(id => {
      this.isLoading = true
      if(id){
        return this.orderLineSrv.initEntity$([{fld: 'order', operator: '==', value: id}])
      } else {
        return this.orderLineSrv.initEntity$()
      }
    }).takeUntil(this.ngUnsubscribe).subscribe(orderlines => {this.orderLineData = orderlines; this.isLoading = false})
    }

  ngOnInit() {}

  clicked(brwClick: {fld: string, rec: {}}) {
    let rec = brwClick.fld == 'insert' ? {} : brwClick.rec
    if(!['insert','selection'].includes(brwClick.fld)){
      this.cs.changeDeleteDialog(this.formConfig, rec, this.orderLineSrv.entityPath, this['embeds'] ? this['embeds'] : undefined).catch(err => console.log(err))
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
