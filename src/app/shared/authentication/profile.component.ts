import { Component, OnInit } from '@angular/core'
import { trigger, transition, style, animate } from '@angular/animations'
import { Router } from '@angular/router'

import { AuthService } from '../../services/auth.service'
import { DbService } from '../../services/db.service'
import { GlobService } from '../../services/glob.service'
import { PopupService } from '../../services/popup.service'

@Component({
  selector: 'app-profile',
  animations: [trigger('pageAnim', [transition(':enter', [style({transform: 'translateY(-100%)'}), animate(250)])])],
  styles:
  [`
  button {display: block; margin: 10px;}
  img {display: block; margin: 0px auto 10px;}
  .spacer {-webkit-box-flex: 1; -ms-flex: 1 1 auto; flex: 1 1 auto;}
    `],
  template:
  `
<div [@pageAnim] fxLayout="row" fxLayoutAlign="center center" style="margin-top:100px">
  <mat-card style="width:250px; background-color:aliceblue">
    <mat-card-header>
        <span class="spacer"></span><button mat-button style="margin:0; padding:0; min-width:auto"><mat-icon routerLink="/homepage">close</mat-icon></button>
    </mat-card-header>
    <div fxLayout="column" fxLayoutAlign="center center">
      <img width="100" src="{{_as.user?.photoURL}}">
      <h3>{{displayName}}</h3>
      <h3>{{displayEmail}}</h3>
      <span *ngIf="error" style="margin: 0 auto; color:red">{{ error }}</span>
      <form *ngIf="changeName" #formData='ngForm' (ngSubmit)="onSubmit(formData)" style="width:100%" fxLayout="column" fxLayoutAlign="center center">
        <mat-form-field>
          <input type="text" matInput placeholder="Naam" [(ngModel)]="name" name="name" required>
        </mat-form-field>
        <div fxLayout="row">
          <button mat-raised-button type="button" (click)="cancelUpdateName()">Annuleer</button>
          <button mat-raised-button type="submit" [disabled]="!formData.valid">Wijzig</button>
        </div>
      </form>
      <form *ngIf="changeEmail" #formData='ngForm' (ngSubmit)="onSubmit(formData)" style="width:100%" fxLayout="column" fxLayoutAlign="center center">
        <mat-form-field>
          <input type="text" matInput placeholder="Email adres" [(ngModel)]="email" name="email" required pattern="[^ @]*@[^ @]*">
        </mat-form-field>
        <div fxLayout="row">
          <button mat-raised-button type="button" (click)="cancelUpdateEmail()">Annuleer</button>
          <button mat-raised-button type="submit" [disabled]="!formData.valid">Wijzig</button>
        </div>
      </form>
      <form *ngIf="changeVerification" #formData='ngForm' (ngSubmit)="onSubmit(formData)" style="width:100%" fxLayout="column" fxLayoutAlign="center center">
        <mat-form-field>
          <input type="text" matInput placeholder="Verificatie Code" [(ngModel)]="verificationCode" name="verificationcode" required>
        </mat-form-field>
        <div fxLayout="row">
          <button mat-raised-button type="button" (click)="cancelUpdateVerification()">Annuleer</button>
          <button mat-raised-button type="submit" [disabled]="!formData.valid">Wijzig</button>
        </div>
      </form>
      <div *ngIf="!_as.user.isAnonymous">
        <button *ngIf="!_as.user.providerLogin" color="primary" [disabled]="changeName" mat-raised-button (click)="updateName()">
          <div fxLayoutAlign="start center" style="width:200px">
            <mat-icon style="padding-right:10px">email</mat-icon>
            <span>Wijzig Naam</span>
          </div>
        </button>
        <button *ngIf="!_as.user.providerLogin" color="primary" [disabled]="changeEmail" mat-raised-button (click)="updateEmail()">
          <div fxLayoutAlign="start center" style="width:200px">
            <mat-icon style="padding-right:10px">email</mat-icon>
            <span>Wijzig Email Adres</span>
          </div>
        </button>
        <button *ngIf="!_as.user.providerLogin" color="primary" mat-raised-button (click)="requestPasswordReset()" [disabled]="resetSent">
          <div fxLayoutAlign="start center" style="width:200px">
            <mat-icon style="padding-right:10px">lock</mat-icon>
            <span>Reset Wachtwoord</span>
          </div>
        </button>
        <button color="primary" [disabled]="changeVerification" mat-raised-button (click)="updateVerification()">
          <div fxLayoutAlign="start center" style="width:200px">
            <mat-icon style="padding-right:10px">verified_user</mat-icon>
            <span>Wijzig Verificatie</span>
          </div>
        </button>
      </div>
    </div>
  </mat-card>
</div>
  `,
})
export class ProfileComponent implements OnInit {
  error: any
  name = ''
  email = ''
  password = ''
  displayName = ''
  displayEmail = ''
  feedback = ''
  changeEmail = false
  changeName = false
  resetSent = false
  changeVerification = false
  verificationCode = ''

  constructor(
    public _as: AuthService,
    private router: Router,
    private db: DbService,
    private gs: GlobService,
    private ps: PopupService,
  ) {}

  ngOnInit() {
    this.displayEmail = this._as.user.email ? this._as.user.email : 'Email onbekend'
    this.displayName = this._as.user.displayName ? this._as.user.displayName : 'Naam onbekend'
  }

  onSubmit(formData) {
    if (this.changeName) {
      this._as.changeProfile(this.name, '')
      .then(v => {
        this._as.user.displayName = this.name
        this.gs.activeUser = this._as.user
        this.router.navigate(['/homepage'])
      })
      .catch(e => {this.error = e})
      this.changeName = false
      return
    }
    if (this.changeEmail) {
      this._as.sendUpdateEmail(this.email)
      .then(v => {
        this.router.navigate(['/homepage'])
      })
      .catch(e => {this.error = e})
      this.changeEmail = false
      return
    }
    if (this.changeVerification) {
      this.db.getUniqueValueId((`${this.gs.entityBasePath}/employees`), 'id', this.verificationCode).subscribe(employee => {
        if (employee['organisation']) {
          this.db.updateDoc({employee: employee['id'], organisation: employee['organisation'], displayName: employee['address']['name']}, `users/${this._as.user.uid}`)
          .then(v => {
            this._as.user.employee = employee['id']
            this._as.user.organisation = employee['organisation']
            this._as.user.displayName = employee['address']['name']
            this.gs.activeUser = this._as.user
            this.ps.buttonDialog('Verificatie geslaagd, u kunt bestellingen plaatsen', 'OK')
            this._as.changeProfile(employee['address']['name'], '')
          })
          .catch(e => {
            this.ps.buttonDialog('Verificatie mislukt, u kunt GEEN bestellingen plaatsen', 'OK')
          })
        } else {
          this.ps.buttonDialog('Verificatie mislukt, u kunt GEEN bestellingen plaatsen', 'OK')
        }
      })
      this.changeVerification = false
      this.verificationCode = ''
      return
    }
  }

  updateName() {
    this.changeName = true
  }

  updateEmail() {
    this.changeEmail = true
  }

  updateVerification() {
    this.changeVerification = true
  }

  cancelUpdateName() {
    this.name = ''
    this.changeName = false
  }

  cancelUpdateEmail() {
    this.email = ''
    this.changeEmail = false
  }

  cancelUpdateVerification() {
    this.verificationCode = ''
    this.changeVerification = false
  }

  requestPasswordReset() {
    this._as.sendPasswordReset().catch(e => {this.error = e})
    this.resetSent = true
  }

}
