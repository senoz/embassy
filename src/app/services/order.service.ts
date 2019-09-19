import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection  } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  order$: any;

  constructor(private firestore: AngularFirestore) {
    this.order$ = this.firestore.collection('orderDetails');
  }

  getOrders() {
    return this.order$.snapshotChanges();
  }

  getUnDeliveredOrders() {
    return this.firestore.collection('orderDetails',
    ref => ref.where('isDelivered', '==', false).limit(1))
    .snapshotChanges();
  }

  newOrder(order: Order) {
    return this.order$.add(order);
  }

  cancelOrder(orderId) {
    return this.order$
    .doc(orderId)
    .delete();
  }
}
