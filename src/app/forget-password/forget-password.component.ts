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

  constructor( private formBuilder: FormBuilder) {
   }

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
// twilio.ts
/**
 * Typescript
 * Twilio version: ^3.15.0
 
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Twilio } from 'twilio';
import { ConstantsService } from '../services/constants.service';
import { FormBuilder, ValidatorsFormBuilderFormBuilder } from '@angular/forms';

@Component({
    selector: 'app-forget-password',
    templateUrl: './forget-password.component.html',
    styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
    functions: typeof firebase.functions;
    twilioNumber: string;
    accountSid: string;
    authToken: string;
    client: any;
    submitted: boolean;
    forgetPasswordForm: any;
    userNames = [];

    constructor(
        private globals: ConstantsService,
        private formBuilder: FormBuilder) {
        this.client = new Twilio(this.accountSid, this.authToken);
        this.twilioNumber = this.globals.twilioNumber;
        this.accountSid = this.globals.accountSid;
        this.authToken = this.globals.authToken;
    }

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
        this.userNames.push(this.forgetPasswordForm.value.userName);
        this.sendText(this.userNames);
    }

    sendText(phoneNumbers) {

        phoneNumbers.map(phoneNumber => {
            console.log(phoneNumber);
            if (!this.validE164(phoneNumber)) {
                throw new Error('number must be E164 format!');
            }
            const textContent = {
                body: `You have a new sms from Dale Nguyen :)`,
                to: phoneNumber,
                from: this.twilioNumber
            };
            this.client.messages.create(textContent)
                .then((message) => console.log(message.to));
        });
    }

    validE164(num) {
        return /^\+?[1-9]\d{1,14}$/.test(num);
    }
}
*/