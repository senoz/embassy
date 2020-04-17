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
  fileUrl = '../../assets/apk/embassy.apk'; ;
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
    let url;
    let urlEncode;
    this.orderService.getPromoCode().subscribe(data => {
      let referral = '/';
      if (authService.isLoggedIn) {
        referral = `/referral/${userId}`;
      }
      if (data.length) {
        promotion = data[0].payload.doc.data() as Coupon;
        promoLink = `\n\nPromo Code: *${promotion.couponCode}*`;
        url = `${content}\n\nPlace Order: http://${urlhost}${referral}\n\n${group}${promoLink}`;
      } else {
        url = `${content}\n\nPlace Order: http://${urlhost}${referral}\n\n${group}`;
      }
      urlEncode = encodeURIComponent(url);
      this.whatsappShare = `https://api.whatsapp.com/send?text=${urlEncode}`;
      this.contactUs = `https://api.whatsapp.com/send?phone=91${globals.gpayNumber}`;
    });
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
    } else if (this.authService.isAdminLoggedIn || this.authService.isSuperAdminLoggedIn) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

}
