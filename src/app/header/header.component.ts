import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticateService } from '../services/authenticate.service';
import { ConstantsService } from '../services/constants.service';
import { OrderService } from '../services/order.service';
import { Coupon } from '../models/coupon.model';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  whatsappShare: any;
  userId: string;
  url: any;
  collapsed = true;
  contactUs: string;
  constructor(
    private router: Router,
    public authService: AuthenticateService,
    private globals: ConstantsService,
    private orderService: OrderService
  ) {
    const urlhost = location.host;
    const userId = localStorage.getItem('userId');
    const group = globals.whatsappGroup;
    const content = globals.whatsappContent;
    let promotion;
    let promoLink = '';
    this.orderService.getPromoCode().subscribe(data => {
      if (data.length) {
        promotion = data[0].payload.doc.data() as Coupon;
      }
    });
    if (promotion) {
      promoLink = `\n\nPromo Code: *${promotion.couponCode}*`;
    }
    let referral = '/';
    if (authService.isLoggedIn) {
      referral = `/referral/${userId}`;
    }
    const url = `${content}\n\nPlace Order: http://${urlhost}${referral}\n\n\n${group}${promoLink}`;
    const urlEncode = encodeURIComponent(url);
    this.whatsappShare = `https://api.whatsapp.com/send?text=${urlEncode}`;
    this.contactUs = `https://api.whatsapp.com/send?phone=${globals.gpayNumber}`;
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  logout() {
    this.collapsed = true;
    this.authService.logout();
  }

  goToDashboard() {
    this.collapsed = true;
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }
    if (this.authService.isAdminLoggedIn) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

}
