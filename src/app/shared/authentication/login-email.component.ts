import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { DomSanitizer } from '@angular/platform-browser';
// import { MatIconRegistry } from '@angular/material';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class LoginEmailComponent implements OnInit {
  error: any
  email = ''
  password = ''

  constructor(
    // private matIconRegistry: MatIconRegistry,
    // private sanitizer: DomSanitizer,
    private as: AuthService,
    private router: Router    
  ) { }

  ngOnInit() {
    // this.matIconRegistry.addSvgIcon('close', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/close.svg'))
  }

  onSubmit(formData) {
    this.as.passwordLogin(this.email, this.password)
    .then(v => {
      this.router.navigate([''])
    })
    .catch(e => {
      this.error = e
    })
  }


}
