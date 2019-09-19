import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection  } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Address } from '../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  address$: any;

  constructor(private firestore: AngularFirestore) {
    this.address$ = this.firestore.collection('address');
  }

  getAddresses() {
    return this.address$.snapshotChanges();
  }

  addAddress(address: Address) {
    return this.address$.add(address);
  }
}
