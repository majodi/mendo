import { Component, OnInit, OnDestroy } from '@angular/core';

// import { AngularFirestore } from 'angularfire2/firestore';

import { Tenant } from '../tenant.model'
import { TenantService } from '../tenant.service';
import { ColumnDefenition } from '../../../shared/custom-components/models/column-defenition.model'
// import { DbService } from '../../../services/db.service'
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-tenants-brw',
  templateUrl: './tenants.brw.html',
  styleUrls: ['./tenants.brw.scss']
})
export class TenantsBrwComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<string>()
  tenants$: Observable<Tenant[]>
  tenantsData: Tenant[]
  tenantsLoading = true
  tenantsColDef: ColumnDefenition[]

  constructor(
    private tenantSrv: TenantService,
    // private afs: AngularFirestore,
    // private db: DbService,
  ) {}

  ngOnInit() {
    this.tenants$ = this.tenantSrv.initTenants$()
    this.tenants$.takeUntil(this.ngUnsubscribe).subscribe(tenants => {
      this.tenantsData = tenants
      this.tenantsLoading = false
    })

    this.tenantsColDef = [
      {name: 'Naam'}
    ]
  }

  clickedTenant(e) {console.log(e)}

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }  

}

    // id: string;
    // meta: EntityMeta;
    // address: Address;
    // banner?: string; // asset
    // logo?: string; // asset
    // order_count: number

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
