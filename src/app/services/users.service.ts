import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection  } from '@angular/fire/firestore';
import { Users } from '../models/users.model';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  user$: AngularFirestoreCollection<Users>;
  user = { isAdmin: false } as Users;
  constructor(private firestore: AngularFirestore) {
    this.user$ = this.firestore.collection('users');
  }

  getUsers() {
    return this.user$.snapshotChanges();
  }

  getSuperAdminUserId() {
     return this.firestore.collection('users',
    ref => ref .where('isSuperAdmin', '==', true).limit(1))
    .snapshotChanges();
  }

  getUserById(id) {
   return this.firestore.collection('users',
    ref => ref.where(firebase.firestore.FieldPath.documentId(), '==', id).limit(1))
    .snapshotChanges();
  }

  setWalletAmount(userId, walletAmount) {
    return this.user$
    .doc(userId)
    .set({ wallet: walletAmount }, { merge: true });
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
