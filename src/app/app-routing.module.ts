import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TenantsBrwComponent } from './entities/tenants/brw/tenants.brw';

const routes: Routes = [{ path: 'tenants', component: TenantsBrwComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
