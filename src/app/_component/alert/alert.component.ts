import {Router} from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService } from '../../services/alert.service';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    message: any;

    constructor(
        private alertService: AlertService,
        private router: Router
    ) { }

    ngOnInit() {
        this.subscription = this.alertService.getMessage().subscribe(message => {
            switch (message && message.type) {
                case 'success':
                    message.cssClass = 'alert alert-success message';
                    break;
                case 'error':
                    message.cssClass = 'alert alert-danger message';
                    break;
            }
            this.message = message;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
