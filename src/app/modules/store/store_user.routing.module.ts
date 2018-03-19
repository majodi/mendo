import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../auth-guard.service';
import { StoreComponent } from '../../entities/tenants/store/store';

const store_userRoutes: Routes = [
  { path: '', canActivate: [AuthGuard],
    children: [
      { path: 'store', component: StoreComponent },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(store_userRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class StoreUserRoutingModule { }


