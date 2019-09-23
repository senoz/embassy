import { mergeMap, switchMap, first } from 'rxjs/internal/operators';
import { pipe, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Users } from '../models/users.model';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { AuthenticateService } from '../services/authenticate.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  submitted = false;
  loginForm;
  private subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private authService: AuthenticateService,
    private alertService: AlertService,
    private router: Router
  ) {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.authService.validateLogin(this.loginForm.value);
    this.authService.currentUser.subscribe(
        data => {
          if (data) {
            this.router.navigate(['/dashboard']);
            return;
          }
        },
        error => {
          this.alertService.error('Login Failed');
          setTimeout(() => {
            this.alertService.blurMessage();
          }, 2000);
          this.submitted = false;
          this.router.navigate(['/login']);
          return;
        });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

}
