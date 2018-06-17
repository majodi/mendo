import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { AuthGuard } from '../auth-guard.service'
import { TenantsBrwComponent } from '../entities/tenants/tenants.brw'
import { EmailAddressesBrwComponent } from '../entities/tenants/emailaddresses/emailaddresses.brw'

const app_superRoutes: Routes = [
  { path: '', canActivate: [AuthGuard],
    children: [
      { path: 'tenants', component: TenantsBrwComponent },
      { path: 'emailaddresses', component: EmailAddressesBrwComponent },
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(app_superRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppSuperRoutingModule { }


