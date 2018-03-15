import { Component, OnInit, trigger, transition, style, animate } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

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
      <form *ngIf="changeEmail" #formData='ngForm' (ngSubmit)="onSubmit(formData)" style="width:100%" fxLayout="column" fxLayoutAlign="center center">
        <mat-form-field>
          <input type="text" matInput placeholder="Email adres" [(ngModel)]="email" name="email" required pattern="[^ @]*@[^ @]*">
        </mat-form-field>
        <div fxLayout="row">
          <button mat-raised-button type="button" (click)="cancelUpdateEmail()">Annuleer</button>
          <button mat-raised-button type="submit" [disabled]="!formData.valid">Wijzig</button>
        </div>
      </form>
      <div *ngIf="!_as.user.providerLogin && !_as.user.isAnonymous">
        <button color="primary" [disabled]="changeEmail" mat-raised-button (click)="updateEmail()">
          <div fxLayoutAlign="start center" style="width:200px">
            <mat-icon style="padding-right:10px">email</mat-icon>
            <span>Wijzig Email Adres</span>
          </div>
        </button>
        <button color="primary" mat-raised-button (click)="requestPasswordReset()" [disabled]="resetSent">
          <div fxLayoutAlign="start center" style="width:200px">
            <mat-icon style="padding-right:10px">lock</mat-icon>
            <span>Reset Wachtwoord</span>
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
  email = ''
  password = ''
  displayName = ''
  displayEmail = ''
  feedback = ''
  changeEmail = false
  resetSent = false

  constructor(
    public _as: AuthService,
    private router: Router    
  ) {}

  ngOnInit() {
    this.displayEmail = this._as.user.email ? this._as.user.email : 'Email onbekend'
    this.displayName = this._as.user.displayName ? this._as.user.displayName : 'Naam onbekend'
  }

  onSubmit(formData) {
    this._as.sendUpdateEmail(this.email)
    .then(v => {
      this.router.navigate(['/homepage'])
    })
    .catch(e => {this.error = e})
    this.changeEmail = false
  }

  updateEmail() {
    this.changeEmail = true
  }

  cancelUpdateEmail() {
    this.email = ''
    this.changeEmail = false
  }

  requestPasswordReset() {
    this._as.sendPasswordReset().catch(e => {this.error = e})
    this.resetSent = true
  }  
  
}
