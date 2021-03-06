import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { AuthGuard } from '../../auth-guard.service'
import { TripAddressBrwComponent } from '../../entities/tenants/tripaddresses/tripaddresses.brw'
import { VehiclesBrwComponent } from '../../entities/tenants/vehicles/vehicles.brw'
import { TripBrwComponent } from '../../entities/tenants/trips/trips.brw'

const trip_tenantRoutes: Routes = [
  { path: '', canActivate: [AuthGuard],
    children: [
      { path: 'tripaddresses', component: TripAddressBrwComponent },
      { path: 'vehicles', component: VehiclesBrwComponent },
      { path: 'trips', component: TripBrwComponent },
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(trip_tenantRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class TripTenantRoutingModule { }
