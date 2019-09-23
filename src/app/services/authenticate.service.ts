import { Observable, BehaviorSubject } from 'rxjs';
import { UsersService } from './users.service';
import { Injectable } from '@angular/core';
import { Users } from '../models/users.model';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { User } from '../../../node_modules/firebase';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  isLoggedIn = false;
  users: Users[];

  constructor(
    private userService: UsersService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.userService.getUsers().subscribe(data => {
      this.users = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Users;
      });
    });
  }

  validateLogin(data) {
    let userData;
    this.userService.checkValidUser(data.userName, data.password).subscribe(users => {
      if (users.length) {
        userData = users[0].payload.doc.data() as Users;
        userData.id = users[0].payload.doc.id;
        this.userService.user = userData;
        this.isLoggedIn = true;
        localStorage.setItem('userId', userData.id);
        this.router.navigate(['/dashboard']);
      } else {
        this.isLoggedIn = false;
        this.alertService.error('Login Failed');
        setTimeout(() => {
          this.alertService.blurMessage();
        }, 2000);
        this.router.navigate(['/login']);
      }
    });
  }

  logout() {
    // remove user from local storage to log user out
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  createUser(user: Users) {
    const newUser = this.userService.addUser(user);
    if (newUser) {
      this.userService.user = user;
      localStorage.setItem('userId', user.id);
      this.isLoggedIn = true;
    }
    return newUser;
  }

  isUserExists(userName) {
    return this.userService.isUserExists(userName);
  }
}
