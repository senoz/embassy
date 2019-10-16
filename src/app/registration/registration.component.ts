import { first } from 'rxjs/internal/operators';
import { Subscription, pipe } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Users } from '../models/users.model';
import { UsersService } from '../services/users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticateService } from '../services/authenticate.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, OnDestroy {

  submitted = false;
  RegisterForm;
  users: Users[];
  private subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private authService: AuthenticateService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
    const refferedBy = this.route.snapshot.params.id;
    if (refferedBy) {
      localStorage.setItem('refferedBy', refferedBy);
    }
    this.RegisterForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      userName: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
    });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.RegisterForm.invalid) {
      return;
    }

    this.subscription = this.authService.isUserExists(this.RegisterForm.value.userName).subscribe(data => {
      if (data.length) {
        this.alertService.error('Mobile number has already exists');
        setTimeout(() => {
          this.alertService.blurMessage();
        }, 2000);
      } else {
        this.authService.createUser(this.RegisterForm.value)
      }
      this.subscription.unsubscribe();
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.RegisterForm.controls;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
