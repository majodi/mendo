import { Component, OnInit, OnDestroy, Injector } from '@angular/core';

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template';
import { OrderLine, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from '../orderlines/orderline.model'
import { OrderLineService } from '../orderlines/orderline.service';

import { BrwBaseClass } from '../../../baseclasses/browse';
import { MatDialogRef } from '@angular/material';
import { Embed } from '../../../shared/dynamic-form/models/embed.interface';
import { Order } from '../orders/order.model';
import { Employee } from '../organisations/employees/employee.model';


@Component({
  selector: 'app-cart',
  styles: [`
  .spacer {-webkit-box-flex: 1; -ms-flex: 1 1 auto; flex: 1 1 auto;}
  .boxed {margin: 10px 10px; border: 3px solid #3f51b5; border-radius: 5px; width:65%; padding: 10px}
  `],
  template: `
    <div fxLayout="column" class="boxed">
      <p class="mat-subheading-1">Budget: {{employeeBudget}}</p>
      <p class="mat-subheading-1">Uitgave incl. deze order: {{employeeSpent + total}}</p>
      <p class="mat-subheading-1">Over na deze order: {{employeeBudget - (employeeSpent + total)}}</p>
    </div>
    <app-table
    [title]="title"
    [titleIcon]="titleIcon"
    [isLoading]="isLoading"
    [selectMode]="selectMode"
    [soberMode]="soberMode"
    [selectionButton]="selectionButton"
    [selectionActive]="selectionActive"
    [data]="data"
    [columnDefs]="colDef"
    (clicked)="clicked($event)"
  ></app-table>  
    <div fxLayout="column">
      <p class="mat-title">Totaal: {{total}}</p>
      <button mat-button (click)="placeOrder()" [disabled]="(employeeBudget - (employeeSpent + total)) < 0">Bestelling plaatsen</button>
      <button mat-button mat-dialog-close>Terug naar winkel</button>
    </div>
  `,
})
export class CartComponent extends BrwBaseClass<OrderLine[]> implements OnInit, OnDestroy {
    order = ''
    employeeId = ''
    employeeBudget = 0
    employeeSpent = 0
    total = 0
    embeds: Embed[] = [
        {type: 'beforeChgDialog', code: (rec, fld) => {
          if(fld == 'remove' && !this.selectMode){
            this.ps.buttonDialog(`${rec['article_v']}\r\nVerwijderen uit bestelling?`, 'OK', 'Annuleer').then(v => {
                if(v == 1){
                    this.db.deleteDoc(`${this.gs.entityBasePath}/orderlines/${rec['id']}`)
                }
                return true
            })
            return true
          }
          return true // skip update frm this way
        }},    
      ]
    
  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: OrderLineService,
  ) {
    super(dialogRef, entityService, injectorService);
    this.dataLoaded.subscribe(v => {
        if(this.data && this.data != undefined && this.data != null){
            this.total = this.data.reduce((a, b) => a + Number(b['amount']), 0)
        }
    })
  }

  ngOnInit() {
    // console.log('queriesread en queries: ', this.gs.NavQueriesRead, this.gs.NavQueries)
    this.title = 'Winkelwagen'
    this.titleIcon = defaultTitleIcon
    this.colDef = [
        {name: 'article_v',         header: 'Artikel', sort: true},
        {name: 'price_unit',        header: 'Prijs', hideXs: true},
        {name: 'number',            header: 'Aantal', hideXs: true},
        {name: 'amount',            header: 'Bedrag', hideXs: true},
        {name: 'remove',            header: '-', icon: 'remove_shopping_cart', flex: '15'},
      ]
    this.formConfig = defaultFormConfig.map(x => Object.assign({}, x));
    // this.formConfig = defaultFormConfig
    super.ngOnInit() //volgorde van belang!
    this.initData()
  }

  initData() {
    this.isLoading = true
    this.order = ''+this.baseQueries.find(q => q.fld == 'order' && q.operator == '==')['value']
    this.db.getDoc(`${this.gs.entityBasePath}/orders/${this.order}`).then((order: Order) => {
      this.db.getDoc(`${this.gs.entityBasePath}/employees/${order.employee}`)
      .then((employee: Employee) => {
        this.employeeId = order.employee
        this.employeeBudget = employee.budget
        this.employeeSpent = isNaN(employee.spent) ? 0 : employee.spent
      })        
    })
    this.isLoading = false
  }

  placeOrder() {
    this.ps.buttonDialog(`Bestelling plaatsen?`, 'OK', 'Annuleer').then(v => {
        if(v == 1){
            this.isLoading = true
            // const order = this.baseQueries.find(q => q.fld == 'order' && q.operator == '==')['value']
            this.db.updateDoc({status: 'closed'}, `${this.gs.entityBasePath}/orders/${this.order}`)
            .then(() => {
              this.db.updateDoc({spent: this.employeeSpent+this.total}, `${this.gs.entityBasePath}/employees/${this.employeeId}`)
              .then(() => {
                this.isLoading = false
                this.dialogRef.close()
                this.ps.buttonDialog('Bestelling geplaatst, u ontvant een bevestiging per email', 'OK')
              })
              .catch(e => {
                console.log('spent niet updated, logging ergens...')
              })
            })
            .catch(e => {
              this.isLoading = false; this.ps.buttonDialog('Kan bestelling niet plaatsen\r\n' + e, 'OK')
            })
        }
    })
  }

}
