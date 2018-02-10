import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TenantsBrwComponent } from './entities/tenants/brw/tenants.brw';
import { FrmTestComponent } from './entities/tenants/frm/frmtest';

const routes: Routes = [
  { path: 'tenants', component: TenantsBrwComponent },
  { path: 'frmtest', component: FrmTestComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
