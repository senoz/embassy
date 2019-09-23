import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection  } from '@angular/fire/firestore';
import { Users } from '../models/users.model';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  user$: AngularFirestoreCollection<Users>;
  user: any;
  constructor(private firestore: AngularFirestore) {
    this.user$ = this.firestore.collection('users');
  }

  getUsers() {
    return this.user$.snapshotChanges();
  }

  checkValidUser(userName, password) {
    return this.firestore.collection('users',
    ref => ref.where('userName', '==', userName)
    .where('password', '==', password)
    .limit(1))
    .snapshotChanges();
  }

  addUser(user: Users) {
    return this.user$.add(user);
  }

  isUserExists(userName) {
    return this.firestore.collection('users',
    ref => ref.where('userName', '==', userName)
    .limit(1))
    .snapshotChanges();
  }
}
