import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatIconBase, MatButtonModule, MatIconModule } from '@angular/material'

import { SharedModule } from '../../shared/shared.module'
import { TripBrwComponent } from '../../entities/tenants/trips/trips.brw'
import { TripService } from '../../entities/tenants/trips/trip.service'
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
      TripBrwComponent,
      TripAddressBrwComponent,
      VehiclesBrwComponent,
    ],
  exports: [
      TripBrwComponent,
      TripAddressBrwComponent,
      VehiclesBrwComponent,
    ],
  entryComponents: [],
  providers: [
      TripService,
      TripAddressService,
      VehicleService,
    ]
})
export class TripTenantModule { }
