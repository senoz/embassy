import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection  } from '@angular/fire/firestore';
import { Users } from '../models/users.model';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  user$: AngularFirestoreCollection<Users>;

  constructor(private firestore: AngularFirestore) {
    this.user$ = this.firestore.collection('users');
  }

  getUsers() {
    return this.user$.snapshotChanges();
  }

  addUser(user: Users) {
    return this.user$.add(user);
  }
}
