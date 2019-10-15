import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {HttpHeaders, HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
    forgetPasswordForm: any;
    submitted: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {}

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
    const url = 'https://us-central1-embassypdw.cloudfunctions.net/forgotPassword';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'
      })
     };
    this.http.post('http://localhost:5000/embassypdw/us-central1/forgotPassword',
    this.forgetPasswordForm.value.userName, httpOptions)
    .subscribe(email => {
      console.log(email);
    });
  }
    // convenience getter for easy access to form fields
  get f() {
    return this.forgetPasswordForm.controls;
  }
}
