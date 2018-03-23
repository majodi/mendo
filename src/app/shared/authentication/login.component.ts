import { Component, OnInit, trigger, transition, style, animate } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
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
    <div fxLayout="column" fxLayoutAlign="center">
      <div style="text-align:center"><mat-icon style="font-size:60px; margin-left:-20px">lock</mat-icon></div>
      <span *ngIf="error" style="margin: 0 auto; color:red">{{ error }}</span>
      <button mat-raised-button (click)="loginGoogle()">
        <div fxLayout="row" fxLayoutAlign="start center">
          <mat-icon fxFlex="30" svgIcon="google"></mat-icon>
          <span>Aanmelden Met Google</span>
        </div>
      </button>
      <button mat-raised-button routerLink="/login-email">
        <div fxLayout="row" fxLayoutAlign="start center">
          <mat-icon fxFlex="30">email</mat-icon>
          <span>Aanmelden Met Email</span>
        </div>
      </button>
      <a mat-button routerLink="/sign-up">Nog geen account? <strong>Registreren.</strong></a>
    </div>
  </mat-card>
</div>
`
})
export class LoginComponent implements OnInit {
  error: any

  constructor(
    private router: Router,
    private as: AuthService
  ) {}

  ngOnInit() {}

  loginGoogle() {
    this.as.googleLogin()
    .then(v => {
      this.router.navigate(['/homepage'])
    })
    .catch(e => this.error = e)
  }

}
