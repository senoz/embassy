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
    .where('isCancelled', '==', false)
    .orderBy('date', 'desc'))
    .snapshotChanges();
  }

  getPendingAmountOrders() {
    return this.firestore.collection('orderDetails',
    ref => ref.where('isDelivered', '==', true)
    .where('isPaid', '==', false)
    .orderBy('date', 'desc'))
    .snapshotChanges();
  }

  getPendingOrdersByUserId(id) {
    return this.firestore.collection('orderDetails',
    ref => ref.where('userId', '==', id)
    .where('isDelivered', '==', false)
    .where('isCancelled', '==', false)
    .orderBy('date', 'desc'))
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

  setPaidUser(userId) {
    this.firestore.collection('orderDetails',
    ref => ref.where('userId', '==', userId))
    .get().toPromise().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const OrderRef = this.firestore.collection('orderDetails').doc(doc.id);
        OrderRef.set({ isPaid: true }, { merge: true });
      });
    });
  }

  deliverOrder(order) {
    const updateAt = firebase.firestore.FieldValue.serverTimestamp();
    return this.order$
    .doc(order.id)
    .set({ isDelivered: true,
       quantity: order.quantity,
       return: order.return,
       isPaid: order.isPaid,
       updateAt: updateAt
       }, { merge: true });
  }

  checkValidPromotion(promo) {
    return this.firestore.collection('promotion',
    ref => ref.where('couponCode', '==', promo)
    .where('isActive', '==', true)
    .limit(1))
    .snapshotChanges();
  }

  getPromoCode() {
    return this.firestore.collection('promotion',
    ref => ref.where('isActive', '==', true)
    .limit(1))
    .snapshotChanges();
  }
}
