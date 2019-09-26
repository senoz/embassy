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
    ref => ref.where('isDelivered', '==', false)
    .where('isCancelled', '==', false))
    .snapshotChanges();
  }

  getPendingOrdersByUserId(id) {
    return this.firestore.collection('orderDetails',
    ref => ref.where('userId', '==', id)
    .where('isDelivered', '==', false)
    .where('isCancelled', '==', false))
    .snapshotChanges();
  }

  getOrderById(id) {
    return this.firestore.collection('orderDetails',
    ref => ref.where(firebase.firestore.FieldPath.documentId(), '==', id).limit(1))
    .snapshotChanges();
  }

  getOrdersByUserId(id) {
    return this.firestore.collection('orderDetails',
    ref => ref.where('userId', '==', id)
    .orderBy('date', 'desc'))
    .snapshotChanges();
  }

  getOrdersByProductId(id) {
    return this.firestore.collection('orderDetails',
    ref => ref.where('productId', '==', id)
    .where('isCancelled', '==', false)
    .where('isDelivered', '==', false))
    .snapshotChanges();
  }

  newOrder(order: Order) {
    order.date = firebase.firestore.FieldValue.serverTimestamp();
    return this.order$.add(order);
  }

  cancelOrder(orderId) {
    return this.order$
    .doc(orderId)
    .set({ isCancelled: true }, { merge: true });
  }

  checkValidPromotion(promo) {
    return this.firestore.collection('promotion',
    ref => ref.where('couponCode', '==', promo)
    .limit(1))
    .snapshotChanges();
  }
}
