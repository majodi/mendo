import { Component, OnInit, OnDestroy } from '@angular/core';
import { componentFactoryName } from '@angular/compiler';

import { AngularFirestore } from 'angularfire2/firestore';

import { Tenant } from '../tenant.model'
import { TenantService } from '../tenant.service';
import { ColumnDefenition } from '../../../models/column-defenition.model'
import { DbService } from '../../../services/db.service'
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-tenants',
  templateUrl: './tenants.html',
  styleUrls: ['./tenants.scss']
})
export class TenantsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<string>()
  tenants$: Observable<Tenant[]>
  tenantsData: Tenant[]
  tenantsLoading = true
  tenantsColDef: ColumnDefenition[]

  constructor(
    private tenantSrv: TenantService,
    private afs: AngularFirestore,
    private db: DbService,
  ) {}

  ngOnInit() {
    this.tenants$ = this.tenantSrv.initTenants$()
    this.tenants$.takeUntil(this.ngUnsubscribe).subscribe(tenants => {
      this.tenantsData = tenants
      this.tenantsLoading = false
    })

    // id: string;
    // meta: EntityMeta;
    // address: Address;
    // banner?: string; // asset
    // logo?: string; // asset
    // order_count: number


    this.tenantsColDef = [
      {name: 'address.name'}

      // {name: 'id', hideXs: true},
      // {name: 'str1', header: ' ', 
      // iconSelect: (rec:TestRec)=>{
      //   if(rec.id.indexOf('33') > 0) return 'cached'
      // }, sort: true},
      // {name: 'num3', sort: true},
      // {name: 'date1', 
      // format: (rec:TestRec)=>{
      //   return new Date(rec.date1).toTimeString()
      // }},
      // {name: 'bool3'}
    ]
  }

  clickedTenant(e) {console.log(e)}

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }  

}
