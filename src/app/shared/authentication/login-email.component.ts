import { Component, OnInit, trigger, transition, style, animate } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-email',
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
      <a mat-button routerLink="/login">Ga terug</a>
      <h2>Aanmelden Met Email</h2>
      <span *ngIf="error" style="margin: 0 auto; color:red">{{ error }}</span>
      <form #formData='ngForm' (ngSubmit)="onSubmit(formData)" style="width:100%" fxLayout="column" fxLayoutAlign="center center">
        <mat-form-field>
          <input type="text" matInput placeholder="Email adres" [(ngModel)]="email" name="email" required>
        </mat-form-field>
        <mat-form-field>
          <input type="password" matInput placeholder="Wachtwoord" [(ngModel)]="password" name="password" required>
        </mat-form-field>
        <button mat-raised-button type="submit" [disabled]="!formData.valid">Aanmelden</button>
        <br>
        <a mat-button routerLink="/sign-up">Nog geen account?</a>
      </form>
    </div>
  </mat-card>
</div>
    `,
})
export class LoginEmailComponent implements OnInit {
  error: any
  email = ''
  password = ''

  constructor(
    private as: AuthService,
    private router: Router    
  ) {}

  ngOnInit() {}

  onSubmit(formData) {
    this.as.passwordLogin(this.email, this.password)
    .then(v => {
      this.router.navigate(['/homepage'])
    })
    .catch(e => {
      this.error = e
    })
  }

}
