import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
    forgetPasswordForm: any;
    submitted: boolean;

  constructor( private formBuilder: FormBuilder) {}

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
  }
    // convenience getter for easy access to form fields
  get f() {
    return this.forgetPasswordForm.controls;
  }
}
