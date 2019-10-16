import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AlertService } from '../services/alert.service';
import { Router } from '@angular/router';
import { AuthenticateService } from '../services/authenticate.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {
  forgetPasswordForm: any;
  submitted: boolean;
  private subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private authService: AuthenticateService,
    private alertService: AlertService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.forgetPasswordForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.pattern('[0-9]{10}')]]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    // stop here if form is invalid
    if (this.forgetPasswordForm.invalid) {
      return;
    }
    this.subscription = this.authService.isUserExists(this.forgetPasswordForm.value.userName).subscribe(data => {
      if (data.length) {
        const url = 'https://us-central1-embassypdw.cloudfunctions.net/forgotPassword';
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'text/plain'
          })
        };
        this.http.post(url, this.forgetPasswordForm.value, httpOptions)
          .subscribe(res => {
            if (res['status'] === 'success') {
              this.alertService.success('Password sent to your Email address');
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 4000);
            }
          });
      } else {
        this.alertService.error('Mobile number has not registered');
        setTimeout(() => {
          this.alertService.blurMessage();
        }, 2000);
      }
      this.subscription.unsubscribe();
    });

  }
  // convenience getter for easy access to form fields
  get f() {
    return this.forgetPasswordForm.controls;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
