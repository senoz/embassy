import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { ApartmentDetails } from '../models/apartment-details.model';

@Injectable({
  providedIn: 'root'
})
export class ApartmentDetailsService {

  apartmentDetails$: AngularFirestoreCollection<ApartmentDetails>;

  constructor(private firestore: AngularFirestore) {
    this.apartmentDetails$ = this.firestore.collection('apartmentDetails');
  }

  getApartmentDetails() {
    return this.apartmentDetails$.snapshotChanges();
  }
}
