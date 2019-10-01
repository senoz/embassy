import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticateService } from '../services/authenticate.service';
import { HttpParameterCodec } from "@angular/common/http";
import { ConstantsService } from '../services/constants.service';
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
    private globals: ConstantsService
  ) { 
    const urlhost = location.host;
    const userId = localStorage.getItem('userId');
    const group = globals.whatsappGroup;
    const content = globals.whatsappContent;
    const url = `${content}\n\nPlace Order: http://${urlhost}/referral/${userId}\n\n\n${group}`;
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
      this.router.navigate(['/admin-dashboard']);
    }
  }

}
