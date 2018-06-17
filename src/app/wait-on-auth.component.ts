import { Component } from '@angular/core'
import { Router,
         NavigationExtras } from '@angular/router'
import { AuthService } from './services/auth.service'
import { PopupService } from './services/popup.service'

@Component({
  styles: [`
  .container-title-text {margin-top:16px; margin-bottom:16px; font-size: calc(24px + 0.25vw)}
  .container-title-icon {font-size: 40px; max-width: 40px; width: auto; margin-right: 15px}
  .item-title {font-size: calc(16px + 0.25vw); line-height: calc(22px + 0.25vw); margin-bottom: 0}
  `],
  template: `
  <div style="text-align: center">
    <p class="mat-display-1 container-title-text">Verbinding leggen</p>
    <br>
    <p class="mat-headline item-title"><b>Ogenblik...</b></p>
  </div>
  `
})
export class WaitOnAuthComponent {
  message: string

  constructor(public as: AuthService, private ps: PopupService, public router: Router) {
    this.as.authReady$.subscribe(() => {
      if (this.as.isLoggedIn) {
        // const name = this.as.user.displayName == 'Alleen Email bekend' || this.as.user.displayName == 'Anoniem' || this.as.user.displayName == 'Annoniem' ? this.as.user.email : this.as.user.displayName
        if (this.as.user.displayName !== 'Alleen Email bekend' && this.as.user.displayName !== 'Anoniem' && this.as.user.displayName !== 'Annoniem') {
          this.ps.buttonDialog('Welkom terug ' + this.as.user.displayName + '!', 'OK')
        }
        const redirectRoute = this.as.navList.find(item => item['link'] === this.as.redirectUrl)
        const redirect = redirectRoute !== undefined ? redirectRoute['link'] : '/homepage'
        this.router.navigate([redirect])
      }
    })
  }

}
