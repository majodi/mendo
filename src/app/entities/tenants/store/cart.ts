import { Component, OnInit, OnDestroy, Injector, ViewChild, ElementRef } from '@angular/core';

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template';
import { OrderLine, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from '../orderlines/orderline.model'
import { OrderLineService } from '../orderlines/orderline.service';

import { BrwBaseClass } from '../../../baseclasses/browse';
import { MatDialogRef } from '@angular/material';
import { Embed } from '../../../shared/dynamic-form/models/embed.interface';
import { Order } from '../orders/order.model';
import { Employee } from '../organisations/employees/employee.model';
import { MessageService } from '../messages/message.service';
import { Tenant } from '../tenant.model';
import { Organisation } from '../organisations/organisation.model';


@Component({
  selector: 'app-cart',
  styles: [`
  .spacer {-webkit-box-flex: 1; -ms-flex: 1 1 auto; flex: 1 1 auto;}
  .boxed {margin: 10px 10px; border: 3px solid #3f51b5; border-radius: 5px; width:65%; padding: 10px}
  `],
  template: `
  <div #printarea style="max-height:90vh;">
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
  </div>
  `,
})
export class CartComponent extends BrwBaseClass<OrderLine[]> implements OnInit, OnDestroy {
    @ViewChild('printarea') private printAreaRef: ElementRef
    order = ''
    orderNumber = ''
    orderDate = new Date()
    employeeId = ''
    employeeName = ''
    employeeBudget = 0
    employeeSpent = 0
    total = 0
    organisationName = ''
    organisationCurrency = ''
    organisationContact = ''
    organisationId = ''
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
    private messageSrv: MessageService,
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
    super.ngOnInit() //volgorde van belang!
    this.initData()
  }

  initData() {
    this.isLoading = true
    this.order = ''+this.baseQueries.find(q => q.fld == 'order' && q.operator == '==')['value']
    this.db.getDoc(`${this.gs.entityBasePath}/orders/${this.order}`).then((order: Order) => {
      this.orderNumber = order.number
      // this.orderDate = order.date take now
      this.db.getDoc(`${this.gs.entityBasePath}/employees/${order.employee}`)
      .then((employee: Employee) => {
        this.employeeId = order.employee
        this.employeeName = employee.address.name
        this.employeeBudget = employee.budget
        this.employeeSpent = isNaN(employee.spent) ? 0 : employee.spent
        this.db.getDoc(`${this.gs.entityBasePath}/organisations/${employee.organisation}`).then((organisation: Organisation) => {
          this.organisationId = employee.organisation
          this.organisationName = organisation.address.name
          this.organisationCurrency = organisation.currency
          this.organisationContact = organisation.address.contact
        })
      })        
    })
    this.isLoading = false
  }

  placeOrder() {
    this.ps.buttonDialog(`Bestelling plaatsen?`, 'OK', 'Annuleer').then(v => {
      if(v == 1){
        this.isLoading = true
        // const order = this.baseQueries.find(q => q.fld == 'order' && q.operator == '==')['value']
        this.db.updateDoc({status: 'closed', total: this.total}, `${this.gs.entityBasePath}/orders/${this.order}`)
        .then(() => {
          this.db.updateDoc({spent: this.employeeSpent+this.total}, `${this.gs.entityBasePath}/employees/${this.employeeId}`)
          .then(() => {
            this.isLoading = false
            this.dialogRef.close()
            this.ps.buttonDialog('Bestelling geplaatst, u ontvant een bevestiging per email', 'OK')
            this.sendMails()
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

  sendMails() {
    this.db.getDoc(`tenants/${this.gs.tenantId}`).then((tenant: Tenant) => {

      //mail naar employee
      let HTMLContent = `
Beste ${this.employeeName},
<br><br>
Wij hebben uw bestelling ontvangen en aangeboden (ter goedkeuring) aan de inkoopafdeling binnen uw bedrijf. Wij zullen na goedkeuring zo spoedig als mogelijk overgaan tot het leveren van onderstaande bestelling.
<br><br>
Met vriendelijke groet,
<br><br>
${tenant.address.name}
<br><br>
<br><br>
      ` + this.orderHTML(tenant)
      this.messageSrv.sendSystemMail('employee', this.employeeId, `Bestelling (${this.orderNumber}) ${this.gs.tenantName}`, '(Deze mail is opgesteld in HTML formaat)', HTMLContent, true)

      //mail naar organisation
      const link = `https://us-central1-mendo-app.cloudfunctions.net/approveorder?tenant=${this.gs.tenantId}&code=${this.order}`
      HTMLContent = `
Beste ${this.organisationContact},
<br><br>
Wij hebben een bestelling ontvangen van een van uw medewerkers en willen deze graag ter goedkeuring aanbieden. Wij zullen na goedkeuring zo spoedig als mogelijk overgaan tot het leveren van onderstaande bestelling.
<br><br>
U kunt deze bestelling goedkeuren binnen het Mendo systeem of door op onderstaande link klikken:
<br><br>
${link}
<br><br>
Met vriendelijke groet,
<br><br>
${tenant.address.name}
<br><br>
<br><br>
      ` + this.orderHTML(tenant)
      this.messageSrv.sendSystemMail('organisation', this.organisationId, `Bestelling (${this.orderNumber}) ${this.gs.tenantName}`, '(Deze mail is opgesteld in HTML formaat)', HTMLContent, false)
    })
  }

  orderHTML(tenant:Tenant) {
    let lines = ''
    this.data.forEach(l => {
    //   console.log('l: ', l)
      lines += `
  <tr class="item">
      <td>
          ${l['article_v']} (Prijs: ${l['price_unit']})
      </td>
      
      <td>
          ${l['amount']}
      </td>
  </tr>

  <tr class="item">
      <td>
          Maat: ${l['size'] ? l['size'] : 'maat ontbreekt'}, Kleur: ${l['color'] ? l['color'] : 'keuze ontbreekt'}
      </td>
      
      <td>

      </td>
  </tr>

  <tr class="item">
      <td>
          Aantal: ${l['number']}
      </td>
      
      <td>

      </td>
  </tr>
`
    })
    return `
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Mendo PWA Platform, NickStick BV</title>
    
    <style>
    .invoice-box {
        max-width: 800px;
        margin: auto;
        padding: 30px;
        border: 1px solid #eee;
        box-shadow: 0 0 10px rgba(0, 0, 0, .15);
        font-size: 16px;
        line-height: 24px;
        font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
        color: #555;
    }
    
    .invoice-box table {
        width: 100%;
        line-height: inherit;
        text-align: left;
    }
    
    .invoice-box table td {
        padding: 5px;
        vertical-align: top;
    }
    
    .invoice-box table tr td:nth-child(2) {
        text-align: right;
    }
    
    .invoice-box table tr.top table td {
        padding-bottom: 20px;
    }
    
    .invoice-box table tr.top table td.title {
        font-size: 45px;
        line-height: 45px;
        color: #333;
    }
    
    .invoice-box table tr.information table td {
        padding-bottom: 40px;
    }
    
    .invoice-box table tr.heading td {
        background: #eee;
        border-bottom: 1px solid #ddd;
        font-weight: bold;
    }
    
    .invoice-box table tr.details td {
        padding-bottom: 20px;
    }
    
    .invoice-box table tr.item td{
        border-bottom: 1px solid #eee;
    }
    
    .invoice-box table tr.item.last td {
        border-bottom: none;
    }
    
    .invoice-box table tr.total td:nth-child(2) {
        border-top: 2px solid #eee;
        font-weight: bold;
    }
    
    @media only screen and (max-width: 600px) {
        .invoice-box table tr.top table td {
            width: 100%;
            display: block;
            text-align: center;
        }
        
        .invoice-box table tr.information table td {
            width: 100%;
            display: block;
            text-align: center;
        }
    }
    
    /** RTL **/
    .rtl {
        direction: rtl;
        font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
    }
    
    .rtl table {
        text-align: right;
    }
    
    .rtl table tr td:nth-child(2) {
        text-align: left;
    }
    </style>
</head>

<body>
    <div class="invoice-box">
        <table cellpadding="0" cellspacing="0">
            <tr class="top">
                <td colspan="2">
                    <table>
                        <tr>
                            <td class="title">
                                <img src="${tenant.logo}" style="width:100%; max-width:300px;">
                            </td>
                            
                            <td>
                                Order: ${this.orderNumber}<br>
                                Datum: ${this.formatDate(this.orderDate)}<br>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <tr class="information">
                <td colspan="2">
                    <table>
                        <tr>
                            <td>
                                ${tenant.address.name}<br>
                                ${tenant.address.address}<br>
                                ${tenant.address.postcode}, ${tenant.address.city}
                            </td>
                            
                            <td>
                                ${this.organisationName}<br>
                                ${this.employeeName}<br>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <tr class="heading">
                <td>
                    Artikel
                </td>

                <td>
                    Bedrag (${this.organisationCurrency})
                </td>
            </tr>
            
${lines}

            <tr class="totaal">
                <td></td>
                
                <td>
                    Total: ${this.total}
                </td>
            </tr>
        </table>
    </div>
</body>
</html>    
    `
  }

  formatDate(date: Date) {
    let formatted = date && typeof date == 'object' ? date.toISOString().substring(0,10) : ''
    return formatted.slice(8)+'-'+formatted.slice(5,8)+formatted.slice(0,4)
  }

}
