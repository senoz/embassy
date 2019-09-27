import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticateService } from '../services/authenticate.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userId: string;
  url: any;
  collapsed = false;
  constructor(
    private router: Router,
    public authService: AuthenticateService
  ) { 
    this.url = location.host;
    this.userId = localStorage.getItem('userId');
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  ngOnInit() {
    this.toggleCollapsed();
  }


}
