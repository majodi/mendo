import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MatIconRegistry, MatSidenav } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { GlobService } from './services/glob.service';
import { PopupService } from './services/popup.service';

@Component({
  selector: 'app-root',
  styles: [`
  .main-container {display: flex; flex-direction: column; position: absolute; top: 0; bottom: 0; left: 0; right: 0;}
  .spacer {-webkit-box-flex: 1; -ms-flex: 1 1 auto; flex: 1 1 auto;}
  .avatar-img {border-radius: 50%; width:40px;}
  .is-mobile .sidenav-container {flex: 1 0 auto;}
  .is-mobile .main-toolbar {position: fixed; z-index: 2;}
  h1.app-name {margin-left: 8px;}
  .sidenav-container {flex: 1;}
  .mat-list-item {font-size:12px;}
  .mat-list-item mat-icon {margin-right:10px;}
  `],
  template: `
<div class="main-container" [class.is-mobile]="mobileQuery.matches">
  <mat-toolbar color="primary" class="main-toolbar">
    <button *ngIf="_as.userLevel > 0" mat-icon-button (click)="snav.toggle()"><mat-icon>menu</mat-icon></button>
    <button *ngIf="_gs.backButton" mat-button color="warn" (click)="routerGoBack()">
      <mat-icon>fast_rewind</mat-icon>
      Terug
    </button>
    <ng-container *ngIf="!_gs.backButton">
      <h1 class="app-name" (click)="about()">{{_as.tenantName}}</h1>
    </ng-container>
    <span class="spacer"></span>
    <mat-menu #accountMenu="matMenu">
      <button mat-menu-item routerLink="/profile"> Profiel </button>
      <button mat-menu-item [disabled]="!_as.user?.isAnonymous" routerLink="/login"> Aanmelden </button>
      <button mat-menu-item [disabled]="_as.user?.isAnonymous" (click)="signOut()"> Afmelden </button>
    </mat-menu>  
    <img src="{{_as.user?.photoURL}}" class="avatar-img" alt="" [matMenuTriggerFor]="accountMenu">
  </mat-toolbar>
  <mat-sidenav-container class="sidenav-container"
                         [style.marginTop.px]="mobileQuery.matches ? 56 : 0">
    <mat-sidenav #snav [style.width]="'200px'" class="mendo-dark-theme" [mode]="mobileQuery.matches ? 'over' : 'side'"
                 [fixedInViewport]="mobileQuery.matches" fixedTopGap="56">
      <mat-nav-list>
        <a mat-list-item *ngFor="let item of _as.navList" [routerLink]="item.link" (click)="navClick(item)"><mat-icon>{{item.icon}}</mat-icon>{{item.text}}</a>
      </mat-nav-list>
    </mat-sidenav>
    <mat-sidenav-content>
        <router-outlet></router-outlet>
    </mat-sidenav-content>
  </mat-sidenav-container>
</div>
`
})
export class AppComponent {
  title = 'Mendo'
  @ViewChild('snav') sidenav: MatSidenav;
  mobileQuery: MediaQueryList
  private _mobileQueryListener: () => void

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public _as: AuthService,
    private sanitizer: DomSanitizer,
    private iconReg: MatIconRegistry,
    private router: Router,
    private location: Location,
    public _gs: GlobService,
    private ps: PopupService,
  ) {
    iconReg.addSvgIcon('google', sanitizer.bypassSecurityTrustResourceUrl('/assets/google.svg'))
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      if (this.mobileQuery.matches) {
        this.sidenav.close()
      }
    })
  }

  signOut() {this._as.signOut()}

  navClick() {
    this._gs.backButton = false
    this._gs.NavQueries = []
  }

  routerGoBack() {
    this._gs.backButton = false
    this._gs.NavQueries = []
    this.location.back()
  }

  about() {
    this.ps.buttonDialog('Mendo PWA-platform v0.1 NickStick B.V.', 'OK')
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}

