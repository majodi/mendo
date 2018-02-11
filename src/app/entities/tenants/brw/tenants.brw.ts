import { Component, OnInit, OnDestroy } from '@angular/core';

import { Tenant, tenantsTitle, tenantsTitleIcon } from '../tenant.model'
import { TenantService } from '../tenant.service';
import { ColumnDefenition } from '../../../shared/custom-components/models/column-defenition.model'
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-tenants-brw',
  templateUrl: './tenants.brw.html',
  styleUrls: ['./tenants.brw.scss']
})
export class TenantsBrwComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<string>()
  title = tenantsTitle
  titleIcon = tenantsTitleIcon
  tenants$: Observable<Tenant[]>
  tenantsData: Tenant[]
  tenantsLoading = true
  tenantsColDef: ColumnDefenition[]

  constructor(
    private tenantSrv: TenantService,
  ) {}

  ngOnInit() {
    this.tenants$ = this.tenantSrv.initTenants$()
    this.tenants$.takeUntil(this.ngUnsubscribe).subscribe(tenants => {
      this.tenantsData = tenants
      this.tenantsLoading = false
    })

    this.tenantsColDef = [
      {name: 'address.name', header: 'Naam', sort: true},
      {name: 'address.address', header: 'Adres', hideXs: true},
      {name: 'address.postcode', header: 'Postcode', hideXs: true},
      {name: 'address.city', header: 'Woonplaats', sort: true}
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

    // name: string;
    // description: string;
    // address: string;
    // postcode: string;
    // city: string;
    // telephone: string;
    // web: string;
    // email: string;
    // contact?: string; // user

    // banner?: string; // asset
    // logo?: string; // asset
    // order_count: number
