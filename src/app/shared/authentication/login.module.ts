import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule, MatFormFieldModule, MatButtonModule, MatCardModule, MatIconModule } from '@angular/material';

import { LoginComponent } from './login.component';
import { LoginEmailComponent } from './login-email.component';
import { SignUpComponent } from './sign-up.component';
import { ProfileComponent } from './profile.component';

@NgModule({
  imports: [
      CommonModule,
      RouterModule,
      FormsModule, ReactiveFormsModule,
      FlexLayoutModule,
      MatInputModule, MatFormFieldModule, MatButtonModule, MatCardModule, MatIconModule,
    ],
  declarations: [
    LoginComponent,
    LoginEmailComponent,
    SignUpComponent,
    ProfileComponent,
  ],
  entryComponents: [

  ],
  exports: [
    LoginComponent,
    LoginEmailComponent,
    SignUpComponent,
    ProfileComponent,
  ],
})
export class LoginModule { }
