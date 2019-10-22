import { Observable, BehaviorSubject } from 'rxjs';
import { UsersService } from './users.service';
import { Injectable } from '@angular/core';
import { Users } from '../models/users.model';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { User } from '../../../node_modules/firebase';
import { AlertService } from './alert.service';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  isLoggedIn = false;
  isAdminLoggedIn = false;
  isSuperAdminLoggedIn = false;
  users: Users[];

  constructor(
    private userService: UsersService,
    private alertService: AlertService,
    public afAuth: AngularFireAuth,
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
    // afAuth.authState.subscribe(x => {
    //   this.isLoggedIn = true;
    //   console.log(x);
    //  // localStorage.setItem('userId', x);
    //   this.router.navigate(['/dashboard']);
    // });
  }

  validateLogin(data) {
    let userData;
    this.userService.checkValidUser(data.userName, data.password).subscribe(users => {
      if (users.length) {
        userData = users[0].payload.doc.data() as Users;
        userData.id = users[0].payload.doc.id;
        this.userService.user = userData;
        if (!userData.isAdmin) {
          this.isLoggedIn = true;
          localStorage.setItem('userId', userData.id);
          this.router.navigate(['/dashboard']);
        } else if (userData.isSuperAdmin) {
          this.isSuperAdminLoggedIn = true;
          this.isAdminLoggedIn = true;
          localStorage.setItem('adminUser', userData.id);
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.isAdminLoggedIn = true;
          localStorage.setItem('adminUser', userData.id);
          this.router.navigate(['/admin/dashboard']);
        }
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
    this.isAdminLoggedIn = false;
    this.isSuperAdminLoggedIn = false;
   // this.afAuth.auth.signOut();
    localStorage.removeItem('userId');
    localStorage.removeItem('adminUser');
    this.router.navigate(['/login']);
  }

  createUser(user: Users) {
    user.wallet = 0;
    user.isAdmin = false;
    user.isSuperAdmin = false;
    user.refferedBy = localStorage.getItem('refferedBy') ? localStorage.getItem('refferedBy') : '';
    const userId = this.userService.addUser(user)
    .then(docRef => {
      this.userService.user = user;
      localStorage.setItem('userId', docRef.id);
      this.isLoggedIn = true;
      this.router.navigate(['/dashboard']);
    });
  }

  isUserExists(userName) {
    return this.userService.isUserExists(userName);
  }

  async loginWithGoogle() {
    const result = await this.afAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider());
  }
}
