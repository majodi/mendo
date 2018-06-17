import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { WaitOnAuthComponent } from '../wait-on-auth.component'
import { HomePageComponent } from '../homepage'
import { AuthGuard } from '../auth-guard.service'

const app_userRoutes: Routes = [
    { path: 'waitOnAuth', component: WaitOnAuthComponent },
    { path: 'homepage', component: HomePageComponent, canActivate: [AuthGuard] },
]

@NgModule({
  imports: [
    RouterModule.forChild(app_userRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppUserRoutingModule { }
