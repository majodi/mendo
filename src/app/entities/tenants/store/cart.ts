import { Component, OnInit, OnDestroy, Injector } from '@angular/core';

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template';
import { OrderLine, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from '../orderlines/orderline.model'
import { OrderLineService } from '../orderlines/orderline.service';
// import { OrganisationService } from '../organisations/organisation.service';
// import { EmployeeService } from '../organisations/employees/employee.service';
// import { EmployeesBrwComponent } from '../organisations/employees/employees.brw';
// import { OrganisationsBrwComponent } from '../organisations/organisation.brw';

import { BrwBaseClass } from '../../../baseclasses/browse';
import { MatDialogRef } from '@angular/material';
import { Embed } from '../../../shared/dynamic-form/models/embed.interface';


@Component({
  selector: 'app-cart',
  styles: [`
  .spacer {-webkit-box-flex: 1; -ms-flex: 1 1 auto; flex: 1 1 auto;}
  `],
  template: `
  <p class="mat-title">Totaal: {{total}}</p>
  <button mat-button (click)="placeOrder()">Bestelling plaatsen</button>
  <br>
  <button mat-button mat-dialog-close>Terug naar winkel</button>
  <br><br>
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
  `,
})
export class CartComponent extends BrwBaseClass<OrderLine[]> implements OnInit, OnDestroy {
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
    this.title = 'Winkelwagen'
    this.titleIcon = defaultTitleIcon
    this.colDef = [
        {name: 'article_v',         header: 'Artikel', sort: true},
        {name: 'price_unit',        header: 'Prijs', hideXs: true},
        {name: 'number',            header: 'Aantal', hideXs: true},
        {name: 'amount',            header: 'Bedrag', hideXs: true},
        {name: 'remove',            header: '-', icon: 'remove_shopping_cart', flex: '15'},
      ]
    this.formConfig = defaultFormConfig
    super.ngOnInit() //volgorde van belang!
  }

  placeOrder() {
    this.ps.buttonDialog(`Bestelling plaatsen?`, 'OK', 'Annuleer').then(v => {
        if(v == 1){
            this.isLoading = true
            const order = this.baseQueries.find(q => q.fld == 'order' && q.operator == '==')['value']
            this.db.updateDoc({status: 'closed'}, `${this.gs.entityBasePath}/orders/${order}`)
            .then(() => {this.isLoading = false; this.dialogRef.close()})
            .catch(e => {this.isLoading = false; this.ps.buttonDialog('Kan bestelling niet plaatsen\r\n' + e, 'OK')})
        }
    })
  }

}
