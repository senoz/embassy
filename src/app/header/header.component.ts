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
export class HeaderComponent implements OnInit {
  whatsappShare: any;
  userId: string;
  url: any;
  collapsed = false;
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
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  ngOnInit() {
    this.toggleCollapsed();
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
