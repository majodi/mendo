import { ServiceWorkerModule } from '@angular/service-worker'
import { BrowserModule } from '@angular/platform-browser'
import { NgModule, Injector } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

// import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCheckboxModule, MatSnackBarModule, MatMenuModule, MatDialogModule, MatButtonModule, MatIconModule, MatToolbarModule, MatSidenavModule, MatListModule } from '@angular/material'

import { MediaMatcher } from '@angular/cdk/layout'

import { AngularFireModule } from 'angularfire2'
import { AngularFirestoreModule } from 'angularfire2/firestore'
import { AngularFireAuthModule } from 'angularfire2/auth'
import { AngularFireStorageModule } from 'angularfire2/storage'

import { environment } from '../environments/environment'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { ServicesModule } from './services/services.module'
import { AppUserModule } from './modules/app_user.module'

import { AppLookupModule } from './modules/app_lookup.module'
import { ImagesBrwComponent } from './entities/tenants/images/images.brw'
import { DocumentsBrwComponent } from './entities/tenants/documents/documents.brw'
import { EmployeesBrwComponent } from './entities/tenants/organisations/employees/employees.brw'

import { OrdersBrwComponent } from './entities/tenants/orders/orders.brw'
import { PopupDialog } from './shared/custom-components/components/popupdialog.component'
import { ArticlesBrwComponent } from './entities/tenants/articles/articles.brw'

import { CartComponent } from './entities/tenants/store/cart'

import './rxjs-operators'
import { UsersBrwComponent } from './entities/tenants/users/users.brw'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // FlexLayoutModule,
    MatCheckboxModule, MatSnackBarModule, MatMenuModule, MatDialogModule, MatButtonModule, MatIconModule, MatToolbarModule, MatSidenavModule, MatListModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // .enablePersistence(),
    AngularFireAuthModule,
    AngularFireStorageModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
    ServicesModule,
    AppUserModule,
    AppLookupModule,
    AppRoutingModule, // onderaan houden
  ],
  entryComponents: [DocumentsBrwComponent , ImagesBrwComponent, EmployeesBrwComponent, OrdersBrwComponent, ArticlesBrwComponent, CartComponent, PopupDialog, UsersBrwComponent],
  providers: [MediaMatcher],
  bootstrap: [AppComponent]
})
export class AppModule {}
