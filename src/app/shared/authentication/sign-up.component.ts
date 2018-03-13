import { Component, OnInit, trigger, transition, style, animate } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
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
    <div fxLayout="column" fxLayoutAlign="center center">
      <a mat-button routerLink="/login">Ga terug</a>
      <h2>Registreer nu</h2>
      <span *ngIf="info" style="margin: 0 auto; color:red">{{ info }}</span>
      <form *ngIf="!signedUp" #formData='ngForm' (ngSubmit)="onSubmit(formData)" style="width:100%" fxLayout="column" fxLayoutAlign="center center">
        <mat-form-field>
          <input type="text" matInput placeholder="Email adres" [(ngModel)]="email" name="email" required pattern="[^ @]*@[^ @]*">
        </mat-form-field>
        <mat-form-field>
          <input type="password" matInput placeholder="Wachtwoord" [(ngModel)]="password" name="password" required>
        </mat-form-field>
        <button mat-raised-button type="submit" [disabled]="!formData.valid || signingUp">Creëer account</button>
      </form>
      <a *ngIf="signedUp" mat-button routerLink="/homepage">Ga Verder</a>
    </div>
  </mat-card>
</div>
    `,
})
export class SignUpComponent implements OnInit {
  info = ''
  email = ''
  password = ''
  signingUp = false
  signedUp = false

  constructor(
    private as: AuthService,
    private router: Router    
  ) {}

  ngOnInit() {}

  onSubmit(formData) {
    this.signingUp = true
    this.info = 'Registatie in behandeling...'
    this.as.passwordSignup(this.email, this.password)
    .then(v => {
      this.info = 'Registratie voltooid, u bent aangemeld'
      this.signedUp = true
    //   this.router.navigate(['/homepage'])
    })
    .catch(e => {
      this.signingUp = false
      this.info = ''
      this.info = e
    })
  }
  
}
