import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatMenuModule, MatDialogModule, MatButtonModule, MatIconModule, MatToolbarModule, MatSidenavModule, MatListModule } from '@angular/material';

import { MediaMatcher } from '@angular/cdk/layout';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServicesModule } from './services/services.module';
import { AppSuperModule } from './modules/app_super.module';
// import { AppTenantModule } from './modules/app_tenant.module';
import { AppUserModule } from './modules/app_user.module';
import { StoreTenantModule } from './modules/store/store_tenant.module';
import { StoreUserModule } from './modules/store/store_user.module';

import './rxjs-operators';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatMenuModule, MatDialogModule, MatButtonModule, MatIconModule, MatToolbarModule, MatSidenavModule, MatListModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireStorageModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
    ServicesModule,
    AppUserModule,
    // AppTenantModule,
    // AppSuperModule,
    // StoreUserModule,
    // StoreTenantModule,
    AppRoutingModule, // onderaan houden
  ],
  providers: [MediaMatcher],
  bootstrap: [AppComponent]
})
export class AppModule {}
