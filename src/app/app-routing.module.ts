import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth-guard.service';

// import { HomePageComponent } from './homepage';
// import { TenantsBrwComponent } from './entities/tenants/tenants.brw';
// import { StoreComponent } from './entities/tenants/store/store';
// import { ArticlesBrwComponent } from './entities/tenants/articles/articles.brw';
// import { PropertiesBrwComponent } from './entities/tenants/properties/properties.brw';
// import { CategoriesBrwComponent } from './entities/tenants/categories/categories.brw';
// import { OrganisationsBrwComponent } from './entities/tenants/organisations/organisation.brw';
// import { EmployeesBrwComponent } from './entities/tenants/organisations/employees/employees.brw';
// import { ImagesBrwComponent } from './entities/tenants/images/images.brw';
// import { OrdersBrwComponent } from './entities/tenants/orders/orders.brw';
// import { OrderLinesBrwComponent } from './entities/tenants/orderlines/orderlines.brw';
// import { BulletinsBrwComponent } from './entities/tenants/bulletins/bulletins.brw';
// import { SettingsBrwComponent } from './entities/tenants/settings/settings.brw';
import { LoginComponent } from './shared/authentication/login.component';
import { LoginEmailComponent } from './shared/authentication/login-email.component';
import { SignUpComponent } from './shared/authentication/sign-up.component';
import { ProfileComponent } from './shared/authentication/profile.component';

const routes: Routes = [
  { path: 'app-tenant', loadChildren: 'app/modules/app_tenant.module#AppTenantModule', canLoad: [AuthGuard] },
  { path: 'app-super', loadChildren: 'app/modules/app_super.module#AppSuperModule', canLoad: [AuthGuard] },
  { path: 'store-user', loadChildren: 'app/modules/store/store_user.module#StoreUserModule', canLoad: [AuthGuard] },
  { path: 'store-tenant', loadChildren: 'app/modules/store/store_tenant.module#StoreTenantModule', canLoad: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'login-email', component: LoginEmailComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '', redirectTo: 'homepage', pathMatch: 'full' }, // onderaan houden
  { path: '**', redirectTo: 'homepage' },                  // onderaan houden, kans geven een route te vinden in child routes
];

@NgModule({
  // imports: [RouterModule.forRoot(routes, { enableTracing: true })],  // <-- debugging purposes only !!!!!!!!!!!!!!
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
