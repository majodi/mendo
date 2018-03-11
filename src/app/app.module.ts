import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatDialogModule, MatButtonModule, MatIconModule, MatToolbarModule, MatSidenavModule, MatListModule } from '@angular/material';

import { MediaMatcher } from '@angular/cdk/layout';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EntityServicesModule } from './entities/entity.services.module';
import { ServicesModule } from './services/services.module';
import { AdminModule } from './admin.module';
import { UserModule } from './user.module';

import './rxjs-operators';

import { CustomComponentsModule } from './shared/custom-components/custom-components.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule, MatButtonModule, MatIconModule, MatToolbarModule, MatSidenavModule, MatListModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireStorageModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
    ServicesModule,
    EntityServicesModule,
    AdminModule,
    UserModule,
    AppRoutingModule, // onderaan houden
  ],
  providers: [MediaMatcher],
  bootstrap: [AppComponent]
})
export class AppModule {}
