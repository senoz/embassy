import { Observable, BehaviorSubject } from 'rxjs';
import { UsersService } from './users.service';
import { Injectable } from '@angular/core';
import { Users } from '../models/users.model';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  isLoggedIn = false;
  users: Users[];

  private currentUserSubject: BehaviorSubject<Users> = new BehaviorSubject<Users>(JSON.parse(localStorage.getItem('currentUser')));
  public currentUser: Observable<Users>;

  constructor(
    private userService: UsersService,
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
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Users {
    return this.currentUserSubject.value;
  }

  validateLogin(data) {
    let user;
    for (const key in this.users) {
      if (data.userName == this.users[key].userName
        && data.password == this.users[key].password) {
          sessionStorage.setItem('currentUser', JSON.stringify(this.users[key]));
          this.isLoggedIn = true;
          this.currentUserSubject.next(this.users[key]);
          user = this.users[key];
        }
    }
    return user;
  }

  logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem('currentUser');
    this.isLoggedIn = false;
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  createUser(user: Users) {
    const newUser = this.userService.addUser(user);
    if (newUser) {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      this.isLoggedIn = true;
    }
    return newUser;
  }

}