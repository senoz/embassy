import { AuthenticateService } from './authenticate.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot,  CanActivate} from '@angular/router';
import { UsersService } from './users.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private usersService: UsersService,
    private router: Router,
    private authService: AuthenticateService
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean> | Promise<boolean> | boolean {
      if (sessionStorage.getItem('currentUser')) {
        this.authService.isLoggedIn = true;
        return true;
      }
      return this.router.navigate(['/login']);
  }
}
