import { Component, ChangeDetectorRef, ViewChild, OnInit, OnDestroy, PipeTransform} from '@angular/core'
import { Location } from '@angular/common'
import { MatIconRegistry, MatSidenav, MatMenuTrigger, MatMenu } from '@angular/material'
import { DomSanitizer } from '@angular/platform-browser'
import { MediaMatcher } from '@angular/cdk/layout'
import { Router } from '@angular/router'
import { AuthService } from './services/auth.service'
import { GlobService } from './services/glob.service'
import { PopupService } from './services/popup.service'
import { DbService } from './services/db.service'

@Component({
  selector: 'app-root',
styles: [`
.main-container {display: flex; flex-direction: column; position: absolute; top: 0; bottom: 0; left: 0; right: 0;}
.spacer {-webkit-box-flex: 1; -ms-flex: 1 1 auto; flex: 1 1 auto;}
.avatar-img {border-radius: 50%; width:40px;}
.is-mobile .sidenav-container {flex: 1 0 auto;}
.is-mobile .main-toolbar {position: fixed; z-index: 2;}
h1.app-name {margin-left: 8px;}
h1.user-name {margin-right: 8px;}
.sidenav-container {flex: 1;}
.mat-list-item {font-size:12px;}
.mat-list-item mat-icon {margin-right:10px;}
`],
template: `
<div class="main-container" [class.is-mobile]="mobileQuery.matches">
  <mat-toolbar color="primary" class="main-toolbar">
    <button *ngIf="_as.userLevel == 0 && location.path() === '/homepage' && extraPages.length > 0" mat-icon-button [matMenuTriggerFor]="pageMenu"><mat-icon>menu</mat-icon></button>
    <button *ngIf="_as.userLevel > 0 && location.path() === '/homepage' && extraPages.length > 0 && !sidenav.opened" mat-icon-button (click)="navToggle()"><mat-icon>menu</mat-icon></button>
    <button *ngIf="_as.userLevel > 0 && location.path() === '/homepage' && extraPages.length > 0 && sidenav.opened" mat-icon-button [matMenuTriggerFor]="pageMenu" (click)="navToggle()"><mat-icon>menu</mat-icon></button>
    <button *ngIf="_as.userLevel > 0 && location.path() !== '/homepage' || extraPages.length == 0" mat-icon-button (click)="navToggle()"><mat-icon>menu</mat-icon></button>
    <button *ngIf="_gs.backButton" mat-button color="warn" (click)="routerGoBack()">
      <mat-icon>fast_rewind</mat-icon>
      Terug
    </button>
    <ng-container *ngIf="!_gs.backButton">
      <h1 class="app-name" (click)="about()">{{formatTenantName(_as.tenantName)}}</h1>
    </ng-container>
    <span class="spacer"></span>
    <h1 *ngIf="!mobileQuery.matches" class="user-name">{{_as.user?.displayName}}</h1>
    <mat-menu #accountMenu="matMenu">
      <button mat-menu-item [matMenuTriggerFor]="legalSubMenu">Juridisch</button>
      <button mat-menu-item routerLink="/profile"> Profiel </button>
      <button mat-menu-item [disabled]="!_as.user?.isAnonymous" routerLink="/login"> Aanmelden </button>
      <button mat-menu-item [disabled]="_as.user?.isAnonymous" (click)="signOut()"> Afmelden </button>
    </mat-menu>
    <mat-menu #legalSubMenu="matMenu">
      <button mat-menu-item (click)="getLegal('Privacy_verklaring')"> Privacy verklaring </button>
      <button mat-menu-item (click)="getLegal('Disclaimer')"> Disclaimer </button>
      <button mat-menu-item (click)="getLegal('Algemene_voorwaarden')"> Algemene voorwaarden </button>
    </mat-menu>
    <img src="{{_as.user?.photoURL}}" class="avatar-img" alt="" [matMenuTriggerFor]="accountMenu">
  </mat-toolbar>
  <mat-sidenav-container class="sidenav-container"
                         [style.marginTop.px]="mobileQuery.matches ? 56 : 0">
    <mat-sidenav #snav [style.width]="'200px'" class="mendo-dark-theme" [mode]="mobileQuery.matches ? 'over' : 'side'"
                 [fixedInViewport]="mobileQuery.matches" fixedTopGap="56">
      <mat-nav-list>
        <mat-list-item *ngFor="let item of _as.navList">
          <a *ngIf="item.link.charAt(0) == '@'" [matMenuTriggerFor]="navModuleSubMenu" (click)="navClick(item)">
            <mat-icon>{{item.icon}}</mat-icon>{{item.text}}
          </a>
          <a *ngIf="item.link.charAt(0) != '@' && item.link.charAt(0) != '#'" [routerLink]="item.link" (click)="navClick(item)">
            <mat-icon>{{item.icon}}</mat-icon>{{item.text}}
          </a>
          <mat-menu #navModuleSubMenu="matMenu">
            <div *ngFor="let subitem of _as.navList">
              <button *ngIf="subitem.module == item.link.substring(1) && subitem.link.charAt(0) == '#'" mat-menu-item [routerLink]="subitem.link.substring(1)"><mat-icon>{{subitem.icon}}</mat-icon> {{subitem.text}} </button>
            </div>
          </mat-menu>
        </mat-list-item>
      </mat-nav-list>
    </mat-sidenav>
    <mat-sidenav-content>
        <router-outlet></router-outlet>
    </mat-sidenav-content>
  </mat-sidenav-container>
  <mat-menu #pageMenu="matMenu">
    <div *ngFor="let page of extraPages">
      <button mat-menu-item (click)="setHomePage(page)">{{page}}</button>
    </div>
  </mat-menu>
</div>
`
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Mendo'
  @ViewChild('snav') sidenav: MatSidenav
  @ViewChild('pageMenu') pgMenu: MatMenu
  mobileQuery: MediaQueryList
  private _mobileQueryListener: () => void
  extraPages = []

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public _as: AuthService,
    private sanitizer: DomSanitizer,
    private iconReg: MatIconRegistry,
    private router: Router,
    public location: Location,
    public _gs: GlobService,
    private ps: PopupService,
    private db: DbService,
  ) {
    iconReg.addSvgIcon('google', sanitizer.bypassSecurityTrustResourceUrl('/assets/google.svg'))
    this.mobileQuery = media.matchMedia('(max-width: 600px)')
    this._mobileQueryListener = () => changeDetectorRef.detectChanges()
    this.mobileQuery.addListener(this._mobileQueryListener)
    this._as.authReady$.subscribe(() => {
      if (this._as.isLoggedIn) {
        this.db.getSetting(['SETTINGS:EXTRA_PAGES']).subscribe(pages => {
          this.extraPages = Array.isArray(pages) ? pages : pages.split(',').map(item => item.trim())
          if (this.extraPages.length > 0 && this.extraPages.find(pageChoice => pageChoice === 'Home') === undefined) {this.extraPages = ['Home', ...this.extraPages]}
        })
      }
    })
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      if (this.mobileQuery.matches) {
        this.sidenav.close()
      }
    })
  }

  signOut() {this._as.signOut()}

  setHomePage(page?: string) {
    this._gs.homePageSelected = page
    this._gs.pageChanged$.next(page)
  }

  navClick() {
    this._gs.backButton = false
    this._gs.NavQueries = []
  }

  navToggle() {
    if (this.location.path() === '/homepage') {
      if (this.sidenav.opened) { return }
    }
    this.sidenav.toggle()
  }

  routerGoBack() {
    this._gs.backButton = false
    this._gs.NavQueries = []
    this.location.back()
    this.location.path()
  }

  about() {
    this.ps.buttonDialog(`Mendo PWA-platform v0.82 (10/09/2018) NickStick B.V.\r\n\r\n${navigator.userAgent}`, 'OK')
  }

  formatTenantName(fullName: string) {
    return this.mobileQuery.matches && fullName.length > 20 ? fullName.substr(0, 20).padEnd(25, '...  ') : fullName
  }

  getLegal(doc) {
    if (doc === 'Privacy_verklaring') {
      this.db.getFirst(`tenants/${this._gs.mendo}/documents`, [{fld: 'tagList', operator: '==', value: {'Privacy_verklaring': true}}])
      .subscribe(foundDoc => {
        if (foundDoc['name']) {
          this.ps.buttonDialog('Privacy verklaring', 'Sluit', undefined, undefined, undefined, undefined, foundDoc['name'])
        }
      })
    }
    if (doc === 'Disclaimer') {
      this.db.getFirst(`tenants/${this._gs.mendo}/documents`, [{fld: 'tagList', operator: '==', value: {'Disclaimer': true}}])
      .subscribe(foundDoc => {
        if (foundDoc['name']) {
          this.ps.buttonDialog('Disclaimer', 'Sluit', undefined, undefined, undefined, undefined, foundDoc['name'])
        }
      })
    }
    if (doc === 'Algemene_voorwaarden') {
      this.db.getFirst(`tenants/${this._gs.mendo}/documents`, [{fld: 'tagList', operator: '==', value: {'Algemene_voorwaarden': true}}])
      .subscribe(foundDoc => {
        if (foundDoc['name']) {
          this.ps.buttonDialog('Algemene voorwaarden', 'Sluit', undefined, undefined, undefined, undefined, foundDoc['name'])
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener)
  }

}
