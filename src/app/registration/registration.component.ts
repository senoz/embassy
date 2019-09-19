import { first } from 'rxjs/internal/operators';
import { Subscription, pipe} from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Users } from '../models/users.model';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { AuthenticateService } from '../services/authenticate.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  submitted = false;
  RegisterForm;
  users: Users[];
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
    this.RegisterForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      userName: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.RegisterForm.invalid) {
        return;
    }

    this.registerUser(this.RegisterForm.value);
    this.subscription = this.authService.currentUser.pipe(first())
    .subscribe(
      data => {
          this.alertService.success('Registration successful', true);
          this.router.navigate(['/dashboard']);
      },
      error => {
          this.alertService.error(error);
          this.router.navigate(['/registration']);
      });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.RegisterForm.controls;
  }

  registerUser(data) {
    return this.authService.createUser(data);
  }

}
