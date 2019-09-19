
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Products } from '../models/products.model';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  products$: any;
  product: any;

  constructor(
    public firestore: AngularFirestore,
    private router: Router
  ) {
    this.products$ = this.firestore.collection('products');
  }

  getProducts() {
    return this.products$.snapshotChanges();
  }

  getProductsById(id) {
    return this.firestore.collection('products',
    ref => ref.where(firebase.firestore.FieldPath.documentId(), '==', id).limit(1))
    .snapshotChanges();
  }
}
