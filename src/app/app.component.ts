import { Component, ChangeDetectorRef } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Mendo'
  mobileQuery: MediaQueryList
  private _mobileQueryListener: () => void
  
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public _as: AuthService,
    private sanitizer: DomSanitizer,
    private iconReg: MatIconRegistry
  ) {
    iconReg.addSvgIcon('google', sanitizer.bypassSecurityTrustResourceUrl('/assets/google.svg'))
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {}

  signOut() {this._as.signOut()}

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}
