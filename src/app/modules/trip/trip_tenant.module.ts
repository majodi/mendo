import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatIconBase, MatButtonModule, MatIconModule } from '@angular/material'

import { SharedModule } from '../../shared/shared.module'
import { TripAddressBrwComponent } from '../../entities/tenants/tripaddresses/tripaddresses.brw'
import { TripAddressService } from '../../entities/tenants/tripaddresses/tripaddress.service'
import { VehiclesBrwComponent } from '../../entities/tenants/vehicles/vehicles.brw'
import { VehicleService } from '../../entities/tenants/vehicles/vehicle.service'
import { TripTenantRoutingModule } from './trip_tenant.routing.module'

import { AppLookupModule } from '../app_lookup.module'

@NgModule({
  imports: [
      CommonModule,
      MatIconModule, MatButtonModule,
      SharedModule,
      AppLookupModule,
      TripTenantRoutingModule,
    ],
  declarations: [
      TripAddressBrwComponent,
      VehiclesBrwComponent,
    ],
  exports: [
      TripAddressBrwComponent,
      VehiclesBrwComponent,
    ],
  entryComponents: [],
  providers: [
      TripAddressService,
      VehicleService,
    ]
})
export class TripTenantModule { }
